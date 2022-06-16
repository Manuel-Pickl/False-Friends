class Board {
    maxAngleUsed;
    boardAngle;

    craters;
    ball;
    finish;

    reset() {
        Utility.canvas.textContent = "";

        return this;
    }

    initialize() {
        this.maxAngleUsed = 35;
        this.boardAngle = new Point();
        this.craters = [];
        this.ball = new Ball(new Point(), 20, this.craters);
        this.finish = new Finish(new Point(), this.ball.radius * 1.5);

        return this;
    }

    placeCraters(count) {
        // clear current craters
        this.craters.forEach(crater => crater.remove());
        this.craters.length = 0;

        // generate random non intersecting craters
        for (let i = 0; i < count; i++) {
            // get random crater radius
            let craterRadius = Utility.getRandomIntegerInRange(this.ball.originalRadius * 2, this.ball.originalRadius * 4);

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
                    this.finish.radius,
                    Utility.canvas.clientWidth - this.finish.radius),
                Utility.getRandomIntegerInRange(
                    Utility.headerHeight + this.finish.radius,
                    Utility.canvas.clientHeight - this.finish.radius)
            );

            // check intersection with craters
            this.craters.forEach(crater => {
                let craterDistance = Math.sqrt(Math.pow(finishPosition.x - crater.position.x, 2) + Math.pow(finishPosition.y - crater.position.y, 2));
                if (craterDistance <= this.finish.radius + crater.radius) {
                    craterIntersects = true;
                }
            });
        } while (craterIntersects);

        // set determined position and draw hole
        this.finish.position = debug ? new Point(this.finish.radius, this.finish.radius) :finishPosition;
        this.finish.draw();
    }

    placeBall() {
        // place ball in random position far away from finishing hole
        let ballPosition;
        let maxFinishDistance = 0;

        // find farthest away position on 10 trys
        for (let i = 0; i < 10; i++) {
            // get random ball position
            let tempBallPosition = new Point(
                Utility.getRandomIntegerInRange(
                    this.ball.radius,
                    Utility.canvas.clientWidth - this.ball.radius),
                Utility.getRandomIntegerInRange(
                    Utility.headerHeight + this.ball.radius,
                    Utility.canvas.clientHeight - this.ball.radius)
            );

            // calculate distance to finish hole
            let finishDistance = Math.sqrt(Math.pow(this.finish.position.x - tempBallPosition.x, 2) + Math.pow(this.finish.position.y - tempBallPosition.y, 2));

            // keep farthest away position
            if (finishDistance > maxFinishDistance) {
                maxFinishDistance = finishDistance;
                ballPosition = tempBallPosition;
            }
        }

        // set generated position
        this.ball.position = ballPosition;

        // reset ball size on spawn (size may be 0 from finish animation) & redraw
        this.ball.setRadius(this.ball.originalRadius);
        this.ball.draw();
    }

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

    resolveCollisionWithBounds() {
        this.ball.resolveCollisionWithBounds();
    }

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