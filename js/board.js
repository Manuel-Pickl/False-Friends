class Board {
    maxAngleUsed;
    boardAngle;

    craters;
    ball;
    finish;

    constructor() {
        this.maxAngleUsed = 35;
        this.boardAngle = new Point();

        this.craters = [];
        this.ball = new Ball(new Point(), 20, this.craters);
        this.finish = new Finish(new Point(), this.ball.radius * 1.5);
    }
    
    placeCraters(count) {
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
                    Utility.getRandomIntegerInRange(0, window.innerWidth),
                    Utility.getRandomIntegerInRange(0, window.innerHeight)
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
            //
            if (i < this.craters.length) {
                this.craters[i].position = craterPosition;
                this.craters[i].radius = craterRadius;
                this.craters[i].draw();
            }
            else {
                // add crater to list
                this.craters.push(new Crater(craterPosition, craterRadius).draw());
            }
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
                    Utility.headerHeight + this.finish.radius,
                    window.innerWidth - this.finish.radius),
                Utility.getRandomIntegerInRange(
                    Utility.headerHeight + this.finish.radius,
                    window.innerHeight - this.finish.radius)
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
        let isFinishBallDistanceBigEnough;
        let finishDistance;
        const maxAttempts = 20;
        let attempts = 0;
        do {
            attempts++;
        
            // get random ball position
            ballPosition = new Point(
                Utility.getRandomIntegerInRange(
                    Utility.headerHeight + this.ball.radius, 
                    window.innerWidth - this.ball.radius),
                Utility.getRandomIntegerInRange(
                    Utility.headerHeight + this.ball.radius, 
                    window.innerHeight - this.ball.radius)
            );

            // check if distance to finish line is a minimum value
            finishDistance = Math.sqrt(Math.pow(this.finish.position.x - ballPosition.x, 2) + Math.pow(this.finish.position.y - ballPosition.y, 2));
            isFinishBallDistanceBigEnough = finishDistance <= window.innerHeight * 0.4
        } while (isFinishBallDistanceBigEnough && attempts < maxAttempts);
    
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