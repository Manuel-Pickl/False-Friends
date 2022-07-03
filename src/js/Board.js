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

        return this;
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
            // get random crater radius
            let craterRadius = Utility.getRandomIntegerInRange(this.obstacleRadiusInterval[0], this.obstacleRadiusInterval[1]);

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
                this.obstacles.craters.forEach(crater => {
                    let craterDistance = Math.sqrt(Math.pow(craterPosition.x - crater.position.x, 2) + Math.pow(craterPosition.y - crater.position.y, 2));
                    if (craterDistance <= craterRadius + crater.radius) {
                        craterIntersects = true;
                    }
                });
            // only allow crater position, if no intersection
            } while (craterIntersects);

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
            // get random hill radius
            let hillRadius = Utility.getRandomIntegerInRange(this.obstacleRadiusInterval[0], this.obstacleRadiusInterval[1]);

            let hillPosition;
            let bumpIntersects;
            do {
                bumpIntersects = false;

                // get random hill position
                hillPosition = new Point(
                    Utility.getRandomIntegerInRange(0, Utility.canvas.clientWidth),
                    Utility.getRandomIntegerInRange(0, Utility.canvas.clientHeight)
                );

                // check intersection with other bumps
                this.obstacles.craters.forEach(crater => {
                    let craterDistance = Math.sqrt(Math.pow(hillPosition.x - crater.position.x, 2) + Math.pow(hillPosition.y - crater.position.y, 2));
                    if (craterDistance <= hillRadius + crater.radius) {
                        bumpIntersects = true;
                    }
                });
                this.obstacles.hills.forEach(hill => {
                    let hillDistance = Math.sqrt(Math.pow(hillPosition.x - hill.position.x, 2) + Math.pow(hillPosition.y - hill.position.y, 2));
                    if (hillDistance <= hillRadius + hill.radius) {
                        bumpIntersects = true;
                    }
                });

            // only allow crater position, if no intersection
            } while (bumpIntersects);

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
            // get random hill radius
            let sandRadius = Utility.getRandomIntegerInRange(this.obstacleRadiusInterval[0], this.obstacleRadiusInterval[1]);

            let sandPosition;
            let bumpIntersects;
            do {
                bumpIntersects = false;

                // get random hill position
                sandPosition = new Point(
                    Utility.getRandomIntegerInRange(0, Utility.canvas.clientWidth),
                    Utility.getRandomIntegerInRange(0, Utility.canvas.clientHeight)
                );

                // check intersection with other bumps
                this.obstacles.craters.forEach(crater => {
                    let craterDistance = Math.sqrt(Math.pow(sandPosition.x - crater.position.x, 2) + Math.pow(sandPosition.y - crater.position.y, 2));
                    if (craterDistance <= sandRadius + crater.radius) {
                        bumpIntersects = true;
                    }
                });
                this.obstacles.hills.forEach(hill => {
                    let hillDistance = Math.sqrt(Math.pow(sandPosition.x - hill.position.x, 2) + Math.pow(sandPosition.y - hill.position.y, 2));
                    if (hillDistance <= sandRadius + hill.radius) {
                        bumpIntersects = true;
                    }
                });
                this.obstacles.sands.forEach(sand => {
                    let sandDistance = Math.sqrt(Math.pow(sandPosition.x - sand.position.x, 2) + Math.pow(sandPosition.y - sand.position.y, 2));
                    if (sandDistance <= sandRadius + sand.radius) {
                        bumpIntersects = true;
                    }
                });

            // only allow crater position, if no intersection
            } while (bumpIntersects);

            // intialize crater with generated data and draw
            this.obstacles.sands.push(new Sand(sandPosition, sandRadius).draw());
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
            this.obstacles.craters.forEach(crater => {
                let craterDistance = Math.sqrt(Math.pow(finishPosition.x - crater.position.x, 2) + Math.pow(finishPosition.y - crater.position.y, 2));
                if (craterDistance <= this.finishRadius + crater.radius) {
                    craterIntersects = true;
                }
            });
        } while (craterIntersects);

        this.finish?.remove();

        // generate finish hole on generated position
        finishPosition = !debug ? finishPosition : new Point(this.finishRadius, Utility.canvas.clientHeight - this.finishRadius);
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