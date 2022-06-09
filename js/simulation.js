class Simulation {
    running;
    lastTimestamp;
    stopwatch;
    stopwatchElement

    craterCount;
    board;
    level;
    maxLevel;
    
    constructor() {
        this.lastTimestamp = Date.now();
        this.stopwatchElement = document.querySelector(".stopwatch");

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

    startGame() {
        this.startLevel();
        this.stopwatch = 0;
        this.startSimulation();

        return this;
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
        let timeDifference = (currentTimestamp - this.lastTimestamp) / 1000;
        
        this.board.ball.computePhysics(this.board.boardAngle, timeDifference);
        
        this.lastTimestamp = currentTimestamp;
    
        // update timer
        this.updateStopwatch(timeDifference);
    
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

    updateStopwatch(timeDifference) {
        // update value
        this.stopwatch += timeDifference;

        // get correct format of minutes
        let minutes = Math.floor(this.stopwatch / 60);
        let minutesString = minutes > 0 ? `${minutes}:` : "";
        // get correct format of seconds
        let seconds = this.stopwatch % 60;
        let secondsString = minutes > 0 && seconds < 10 
        ? `0${seconds.toFixed(2)}` 
        : seconds.toFixed(2)
        
        // update ui
        this.stopwatchElement.innerHTML =`${minutesString}${secondsString}`;
    }
}