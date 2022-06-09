class Simulation {
    running;
    lastTimestamp;
    craterCount;
    board;
    level;
    maxLevel;
    
    constructor() {
        this.lastTimestamp = 0;
        this.craterCountDict = {
            1: 0,
            2: 2,
            3: 5,
            4: 10
        }
        this.board = new Board();
        this.level = 1;
        this.maxLevel = 4;
    }

    startSimulation() {
        this.running = true;
        window.addEventListener('deviceorientation', onSensorChanged);
    }
      
    stopSimulation() {
        this.running = false;
        window.removeEventListener('deviceorientation', onSensorChanged);
    }

    simulate() {
        // update the system's positions
        let currentTimestamp = Date.now();
        
        if (this.lastTimestamp != 0) {
            let timeDifference = (currentTimestamp - this.lastTimestamp) / 1000;
        
            this.board.ball.computePhysics(this.board.boardAngle, timeDifference);
        }
    
        this.lastTimestamp = currentTimestamp;
    
        // handle collisions
        this.board.resolveCollisionWithBounds();
    
        // redraw ball
        this.board.ball.draw();
    }

    startLevel(level) {
        // get crater count dependent on current level
        let craterCount = this.craterCountDict[level];

        // set all game objects
        this.board.placeCraters(craterCount);
        this.board.placeFinish();
        this.board.placeBall();
    }

    finishLevel() {
        this.stopSimulation();

        if (this.level < this.maxLevel) {
            // reset ball velocity
            this.board.ball.velocity.x = 0;
            this.board.ball.velocity.y = 0;
            
            // increase and start level    
            this.startLevel(++this.level);
            this.startSimulation();
        }
        else {
            alert("finito");
        }
    }

    isLevelFinished() {
        return this.board.finish.isPointInside(this.board.ball.position, this.board.ball.radius);
    }
}