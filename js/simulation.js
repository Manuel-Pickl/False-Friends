class Simulation {
    running;
    maxAngleUsed;
    
    boardAngle;
    craters;
    ball;

    lastTimestamp;
    
    constructor(fps) {
        this.fps = fps;

        this.maxAngleUsed = 35;
        this.boardAngle = new Point();

        this.craters = [];
        this.ball = new Ball(new Point(), 20, this.craters);

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
        this.craters.length = 0;
    
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
            let crater = new Crater(craterPosition, craterRadius).draw();
            
            // add crater to list
            this.craters.push(crater);
        }
    }

    placeBall() {
        // place ball in random position not intersecting with craters
        let ballPosition;
        let craterIntersects;
        do {
            craterIntersects = false;
        
            // get random ball position
            ballPosition = new Point(
                Utility.getRandomIntegerInRange(this.ball.radius, window.innerWidth - this.ball.radius),
                Utility.getRandomIntegerInRange(this.ball.radius, window.innerHeight - this.ball.radius)
            );
        
            // check intersection with craters
            this.craters.forEach(crater => {
                if (crater.isPointInside(ballPosition)) {
                craterIntersects = true;
                }
            });
        } while (craterIntersects);
    
        this.ball.position = ballPosition;
    }
}