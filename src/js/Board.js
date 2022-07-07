/**
 * The Board holding all canvas objects, like the ball, finish and obstacles
 */
class Board {
    maxAngleUsed;
    boardAngle;

    obstacles;
    obstacleRadiusInterval;
    ball;
    ballRadius;
    finish;
    finishRadius;
    
    maxTries;

    /**
     * Reset the canvas by deleting all ui elements
     * @returns Returns itself for method chaining
     */
    reset() {
        Utility.canvas.textContent = "";

        return this;
    }

    /**
     * Initialize the Board with its default values
     * @returns Returns itself for method chaining
     */
    initialize() {
        this.maxAngleUsed = 35;
        this.boardAngle = new Point();

        this.obstacles = { craters: [], hills: [], sands: []}

        this.ballRadius = 20;
        this.obstacleRadiusInterval = [this.ballRadius * 2, this.ballRadius * 5];
        this.finishRadius = this.ballRadius * 1.5;

        this.maxTries = 10000;

        return this;
    }

    /**
     * Get a random non intersecting position on the board paying attention to the radius
     * @param {int} radius Radius of the circle
     * @param {boolean} allowClipping When set false, the circle has to be completely inside the bounds. Default is true
     * @returns The found position as a Point 
     */
    getNonIntersectingPosition(radius, allowClipping = true, yBoundMin = null, yBoundMax = null) {
        let position;
        let intersects;
        let tries = 0;

        do {
            intersects = false;

            // get random hill position
            position = new Point(
                Utility.getRandomIntegerInRange(0 + (allowClipping ? 0 : radius), Utility.canvas.clientWidth - (allowClipping ? 0 : radius)),
                Utility.getRandomIntegerInRange(yBoundMin ?? (0 + (allowClipping ? 0 : radius)), yBoundMax ?? (Utility.canvas.clientHeight - (allowClipping ? 0 : radius)))
            );

            // check intersection with obstacles
            for (const [bumpType, bumpsOfType] of Object.entries(this.obstacles)) {
                bumpsOfType.forEach(bump => {
                    let bumpDistance = Math.sqrt(Math.pow(position.x - bump.position.x, 2) + Math.pow(position.y - bump.position.y, 2));
                    if (bumpDistance <= radius + bump.radius) {
                        intersects = true;
                    }
                });
            }

            tries++;
        } while (intersects && tries < this.maxTries);

        return position;
    }

    /**
     * Place a given number of craters randomly on the board without intersecting with other obstacles
     * @param {number} count Crater count
     */
    placeCraters(count) {
        // clear current craters
        this.obstacles.craters.forEach(crater => crater.remove());
        this.obstacles.craters.length = 0;

        // generate random non intersecting craters
        for (let i = 0; i < count; i++) {
            // get random crater radius and position
            let craterRadius = Utility.getRandomIntegerInRange(this.obstacleRadiusInterval[0], this.obstacleRadiusInterval[1]);
            let craterPosition = this.getNonIntersectingPosition(craterRadius);
            
            // intialize crater with generated data and draw
            this.obstacles.craters.push(new Crater(craterPosition, craterRadius, 60).draw());
        }
    }

    /**
     * Place a given number of Hills randomly on the board without intersecting with other obstacles
     * @param {number} count Hill count
     */
    placeHills(count) {
        // clear current hills
        this.obstacles.hills.forEach(hill => hill.remove());
        this.obstacles.hills.length = 0;

        // generate random non intersecting hills
        for (let i = 0; i < count; i++) {
            // get random hill radius and position
            let hillRadius = Utility.getRandomIntegerInRange(this.obstacleRadiusInterval[0], this.obstacleRadiusInterval[1]);
            let hillPosition = this.getNonIntersectingPosition(hillRadius);

            // intialize crater with generated data and draw
            this.obstacles.hills.push(new Hill(hillPosition, hillRadius, -60).draw());
        }
    }

    /**
     * Place a given number of Sand puddles randomly on the board without intersecting with other obstacles
     * @param {number} count Sand count
     */
     placeSand(count) {
        // clear current Sand puddles
        this.obstacles.sands.forEach(obstacle => obstacle.remove());
        this.obstacles.sands.length = 0;

        // generate random non intersecting sand puddles
        for (let i = 0; i < count; i++) {
            // get random sand radius and position
            let sandRadius = Utility.getRandomIntegerInRange(this.obstacleRadiusInterval[0], this.obstacleRadiusInterval[1]);
            let sandPosition = this.getNonIntersectingPosition(sandRadius);

            // intialize crater with generated data and draw
            this.obstacles.sands.push(new Sand(sandPosition, sandRadius).draw());
        }
    }

    /**
     * Place the finish randomly on the board without intersecting with obstacles
     */
    placeFinish() {
        // generate random non intersecting finish position
        let finishPosition = this.getNonIntersectingPosition(this.finishRadius, false, Utility.headerHeight + this.finishRadius);
        finishPosition = !debug ? finishPosition : new Point(this.finishRadius, Utility.canvas.clientHeight - this.finishRadius);

        this.finish?.remove();

        // generate finish hole on generated position
        this.finish = new Finish(finishPosition, this.finishRadius).draw();
    }

    /**
     * Place the ball on the board at the given start position.  
     * If no position is given, it's generated randomly, trying to get far away from the finish.
     * @param {Point} ballPosition The start position of the ball.
     */
    placeBall(ballPosition) {
        if (ballPosition == null) {
            // place ball in random position far away from finishing hole
            let maxFinishDistance = 0;
            
            // find farthest away position on 10 trys
            for (let i = 0; i < 10; i++) {
                // get random ball position
                let tempBallPosition = new Point(
                    Utility.getRandomIntegerInRange(
                        this.ballRadius,
                        Utility.canvas.clientWidth - this.ballRadius),
                    Utility.getRandomIntegerInRange(
                        Utility.headerHeight + this.ballRadius,
                        Utility.canvas.clientHeight - this.ballRadius)
                );
    
                // calculate distance to finish hole
                let finishDistance = Math.sqrt(Math.pow(this.finish.position.x - tempBallPosition.x, 2) + Math.pow(this.finish.position.y - tempBallPosition.y, 2));
    
                // keep farthest away position
                if (finishDistance > maxFinishDistance) {
                    maxFinishDistance = finishDistance;
                    ballPosition = tempBallPosition;
                }
            }
        }

        this.ball?.remove();

        // generate ball on generated  position
        this.ball = new Ball(ballPosition, 20, this.obstacles).draw();
    }

    /**
     * Set the X and Y angle of the Board
     * @param {Point} boardAngle X and Y Board angle as Point
     */
    setAngle(boardAngle) {
        // just use sensors till specific angle,
        // because nobody wants to tilt their phone till 90°
        let multiplicator = Physics.maxAngle / this.maxAngleUsed;

        boardAngle.x *= multiplicator;
        boardAngle.y *= multiplicator;

        // cap angle at 90°
        if (boardAngle.x > Physics.maxAngle) {
            boardAngle.x = Physics.maxAngle;
        }
        else if (boardAngle.x < -Physics.maxAngle) {
            boardAngle.x = -Physics.maxAngle;
        }

        if (boardAngle.y > Physics.maxAngle) {
            boardAngle.y = Physics.maxAngle;
        }
        else if (boardAngle.y < -Physics.maxAngle) {
            boardAngle.y = -Physics.maxAngle;
        }

        this.boardAngle.x = boardAngle.x;
        this.boardAngle.y = boardAngle.y;
    }

    /**
     * Resolve Collision with bounds on the board
     */
    resolveCollisionWithBounds() {
        this.ball.resolveCollisionWithBounds();
    }

    /**
     * Animate the Ball falling in the Finish
     * @param {number} deltaTime Time that passed since the last calculation of the balls phyics
     */
    animateBallFalling(deltaTime) {
        // decrease radius
        if (this.ball.radius > 0) {
            // calculate radius decrease
            let radiusDecrease = deltaTime * 20;
            let newRadius = this.ball.radius - radiusDecrease;

            // set new radius
            this.ball.setRadius(newRadius);
        }

        // pull to center

    }
}