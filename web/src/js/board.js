/**
 * The Board holding all canvas objects, like the ball, finish and obstacles
 */
class Board {
    maxAngleUsed;
    boardAngle;

    craters;
    craterRadiusInterval;
    ball;
    ballRadius;
    finish;
    finishRadius;

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

        this.craters = [];
        this.ballRadius = 20;
        this.craterRadiusInterval = [this.ballRadius * 2, this.ballRadius * 5];
        this.finishRadius = this.ballRadius * 1.5;

        return this;
    }

    /**
     * Place a given number of craters randomly on the board without intersecting each other
     * @param {number} count 
     */
    placeCraters(count) {
        // clear current craters
        this.craters.forEach(crater => crater.remove());
        this.craters.length = 0;

        // generate random non intersecting craters
        for (let i = 0; i < count; i++) {
            // get random crater radius
            let craterRadius = Utility.getRandomIntegerInRange(this.craterRadiusInterval[0], this.craterRadiusInterval[1]);

            let craterPosition;
            let craterIntersects;
            do {
                craterIntersects = false;

                // get random crater position
                craterPosition = new Point(
                    Utility.getRandomIntegerInRange(0, Utility.canvas.clientWidth),
                    Utility.getRandomIntegerInRange(0, Utility.canvas.clientHeight)
                );

                // check intersection with other craters
                this.craters.forEach(crater => {
                    let craterDistance = Math.sqrt(Math.pow(craterPosition.x - crater.position.x, 2) + Math.pow(craterPosition.y - crater.position.y, 2));
                    if (craterDistance <= craterRadius + crater.radius) {
                        craterIntersects = true;
                    }
                });
            // only allow crater position, if no intersection
            } while (craterIntersects);

            // intialize crater with generated data and draw
            this.craters.push(new Crater(craterPosition, craterRadius).draw());
        }
    }

    /**
     * Place the finish randomly on the board without intersecting any craters
     */
    placeFinish() {
        // place finishing hole in random position not intersecting with craters
        // and a minimum distance away from ball
        let finishPosition;
        let craterIntersects;
        do {
            craterIntersects = false;

            // get random finish position
            finishPosition = new Point(
                Utility.getRandomIntegerInRange(
                    this.finishRadius,
                    Utility.canvas.clientWidth - this.finishRadius),
                Utility.getRandomIntegerInRange(
                    Utility.headerHeight + this.finishRadius,
                    Utility.canvas.clientHeight - this.finishRadius)
            );

            // check intersection with craters
            this.craters.forEach(crater => {
                let craterDistance = Math.sqrt(Math.pow(finishPosition.x - crater.position.x, 2) + Math.pow(finishPosition.y - crater.position.y, 2));
                if (craterDistance <= this.finishRadius + crater.radius) {
                    craterIntersects = true;
                }
            });
        } while (craterIntersects);

        this.finish?.remove();

        // generate finish hole on generated position
        finishPosition = !debug ? finishPosition : new Point(this.finishRadius, this.finishRadius);
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
        this.ball = new Ball(ballPosition, 20, this.craters).draw();
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
            let radiusDecrease = deltaTime * 30;
            let newRadius = this.ball.radius - radiusDecrease;

            // set new radius
            this.ball.setRadius(newRadius);
        }

        // pull to center

    }
}