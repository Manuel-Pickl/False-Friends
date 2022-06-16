class Simulation {
    running;
    stopwatch;
    stopwatchElement

    craterCount;
    board;
    level;
    maxLevel;
    
    constructor() {
        this.stopwatchElement = document.querySelector(".stopwatch");
        this.craterCountDict = {
            1: 0,
            2: 2,
            3: 5,
            4: 10
        }
        this.maxLevel = Object.keys(this.craterCountDict).length;
        // this.maxLevel = 1
    }

    initialize() {
        this.finished = false;
        this.board = new Board().reset().initialize();
        this.level = 1;

        return this;
    }

    start() {
        this.startLevel(this.level);
        this.stopwatch = 0;
        this.resume();

        return this;
    }


    resume() {
        this.running = true;
        window.addEventListener('deviceorientation', onSensorChanged);

        return this;
    }
      
    pause() {
        this.running = false;
        window.removeEventListener('deviceorientation', onSensorChanged);

        return this;
    }

    simulate(timeDifference) {
        // update the system's positions
        this.board.ball.computePhysics(this.board.boardAngle, timeDifference);
        
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
        this.pause();
        
        // reset ball velocity
        this.board.ball.velocity.x = 0;
        this.board.ball.velocity.y = 0;
        
        // end animation
        let finishHoleAnimationDuration = 1500;
        let lastTimestamp = Date.now();
        let interval = setInterval(function() {
            let currentTimestamp = Date.now();
            let deltaTime = (currentTimestamp - lastTimestamp) / 1000;
          
            this.animateLevelFinish(deltaTime);
          
            lastTimestamp = currentTimestamp;
        }.bind(this), 1000 / fps);
        
        // start new level
        setTimeout(function () {
            clearInterval(interval);
            
            // increase level
            this.level++;

            // check if last level
            if (this.isGameFinished()) {
                return;
            }
            
            // start new level
            this.startLevel(this.level);
            this.start();
        }.bind(this), finishHoleAnimationDuration);
    }

    animateLevelFinish(deltaTime) {
        this.board.animateBallFalling(deltaTime);
      }

    isLevelFinished() {
        return this.board.finish?.isCircleInside(this.board.ball.position, this.board.ball.radius, 0.5);
    }

    isGameFinished() {
        return this.level > this.maxLevel;
    }

    // put stopwatch logic in own class
    updateStopwatch(timeDifference) {
        // update value
        this.stopwatch += timeDifference;

        // update ui
        this.stopwatchElement.textContent = this.stopwatchToString();
    }

    stopwatchToString() {
        // get correct format of minutes
        let minutes = Math.floor(this.stopwatch / 60);
        let minutesString = minutes > 0 ? `${minutes}:` : "";
        
        // get correct format of seconds
        let seconds = this.stopwatch % 60;
        let secondsString = minutes > 0 && seconds < 10 
        ? `0${seconds.toFixed(2)}` 
        : seconds.toFixed(2);

        return `${minutesString}${secondsString}`;
    }
}