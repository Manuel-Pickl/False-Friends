class Simulation {
    running;
    maxAngleUsed;
    
    boardAngle;
    craters;
    ball;
    finish;

    lastTimestamp;
    
    constructor(fps) {
        this.fps = fps;

        this.maxAngleUsed = 35;
        this.boardAngle = new Point();

        this.craters = [];
        this.ball = new Ball(new Point(), 20, this.craters);
        this.finish = new Finish(new Point(), this.ball.radius * 1.5);

        this.lastTimestamp = 0;
    }

    simulate() {
        // update the system's positions
        this.calculateBallPosition();
    
        // handle collisions
        this.ball.resolveCollisionWithBounds();
    
        this.ball.draw();
    }
  
    calculateBallPosition() {
        let currentTimestamp = Date.now();
        
        if (this.lastTimestamp != 0) {
            let timeDifference = (currentTimestamp - this.lastTimestamp) / 1000;
        
            this.ball.computePhysics(this.boardAngle, timeDifference);
        }
    
        this.lastTimestamp = currentTimestamp;
    }

    placeCraters(count) {
        // clear previous craters
        // this.craters.splice(0, this.craters.length)
        // this.craters.length = 0;
    
        // generate random non intersecting craters
        for (let i = 0; i < count; i++) {
            // get random crater radius
            let craterRadius = Utility.getRandomIntegerInRange(this.ball.radius * 2, this.ball.radius * 4);
            
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
            } while (craterIntersects);
            
            // intialize crater with generated data and draw
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
        // place finish in random position not intersecting with craters and ball
        let finishPosition;
        // let craterIntersects;
        // do {
        //     craterIntersects = false;
        
            // get random finish position
            finishPosition = new Point(
                Utility.getRandomIntegerInRange(this.finish.radius, window.innerWidth - this.finish.radius),
                Utility.getRandomIntegerInRange(this.finish.radius, window.innerHeight - this.finish.radius)
            );
        
        //     // check intersection with craters
        //     this.craters.forEach(crater => {
        //         let craterDistance = Math.sqrt(Math.pow(finishPosition.x - crater.position.x, 2) + Math.pow(finishPosition.y - crater.position.y, 2));
        //         if (craterDistance <= this.finish.radius + crater.radius) {
        //             craterIntersects = true;
        //         }
        //     });

        //     // check intersection with ball
        //     let ballDistance = Math.sqrt(Math.pow(finishPosition.x - this.ball.position.x, 2) + Math.pow(finishPosition.y - this.ball.position.y, 2));
        //     if (ballDistance <= this.finish.radius + this.ball.radius) {
        //         craterIntersects = true;
        //     }
        // } while (craterIntersects);
    
        this.finish.position = finishPosition;
        this.finish.position = new Point(20, 20);
        this.finish.draw();
    }
    
    placeBall() {
        // place ball in random position not intersecting with craters
        let ballPosition;
        // let craterIntersects;
        let finishDistance;
        do {
        //     craterIntersects = false;
        
            // get random ball position
            ballPosition = new Point(
                Utility.getRandomIntegerInRange(this.ball.radius, window.innerWidth - this.ball.radius),
                Utility.getRandomIntegerInRange(this.ball.radius, window.innerHeight - this.ball.radius)
            );

            // check distance to finish line
            finishDistance = Math.sqrt(Math.pow(this.finish.position.x - ballPosition.x, 2) + Math.pow(this.finish.position.y - ballPosition.y, 2));
            

        //     // check intersection with craters
        //     this.craters.forEach(crater => {
        //         if (crater.isPointInside(ballPosition)) {
        //         craterIntersects = true;
        //         }
        //     });
        } while (finishDistance <= window.innerHeight / 2);
        // } while (craterIntersects);
    
        this.ball.position = ballPosition;
    }
}