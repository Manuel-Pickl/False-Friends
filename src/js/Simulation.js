/**
 * Main Simulation class running the physic and levels.
 */
class Simulation {
    running;
    stopwatch;
    stopwatchElement

    craterCount;
    board;
    level;
    maxLevel;
    
    /**
     * Creates an instance of Simulation.
     */
    constructor() {
        this.stopwatchElement = document.querySelector(".stopwatch");
        this.obstacleCountDict = {
            1: { crater: 0, hill: 0, sand: 0 },
            2: { crater: 2, hill: 0, sand: 0 },
            3: { crater: 2, hill: 3, sand: 0 },
            4: { crater: 4, hill: 3, sand: 2 },
            5: { crater: 5, hill: 4, sand: 3 }
        }
        this.maxLevel = Object.keys(this.obstacleCountDict).length;
        // this.maxLevel = 1;
    }

    /**
     * Initialize the simulation with its default values.
     * @returns Returns itself for method chaining
     */
    initialize() {
        this.finished = false;
        this.board = new Board().reset().initialize();
        this.level = 1;

        return this;
    }

    /**
     * Start a new simulation.
     * @returns Returns itself for method chaining
     */
    start() {
        this.startLevel(this.level);
        this.stopwatch = 0;
        this.resume();

        return this;
    }

    /**
     * Resume a paused simulation.
     * @returns Returns itself for method chaining
     */
    resume() {
        this.running = true;
        return this;
    }
    
    /**
     * Pause a running simulation.
     * @returns Returns itself for method chaining
     */
    pause() {
        this.running = false;
        return this;
    }

    /**
     * Simulate all components
     * @param {number} timeDifference Time that passed since the last simulate() call
     */
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

    /**
     * Start a given level.
     */
    startLevel(level) {
        // get obstacle count depending on current level
        let craterCount = this.obstacleCountDict[level].crater;
        let hillCount = this.obstacleCountDict[level].hill;
        let sandCount = this.obstacleCountDict[level].sand;

        // set all game objects
        this.board.placeCraters(craterCount);
        this.board.placeHills(hillCount);
        this.board.placeSand(sandCount);
        this.board.placeFinish();
        this.board.placeBall();
    }

    /**
     * Finish the current level.
     */
    finishLevel() {
        this.pause();
        
        // reset ball velocity
        this.board.ball.velocity.x = 0;
        this.board.ball.velocity.y = 0;
        
        // end animation
        let finishHoleAnimationDuration = 2000;
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
            this.resume();

            // update levelcounter on ui
            document.querySelector("main .level span").textContent = this.level;
        }.bind(this), finishHoleAnimationDuration);
    }

    /**
     * Animate the level finish
     */
    animateLevelFinish(deltaTime) {
        this.board.animateBallFalling(deltaTime);
    }

    /**
     * Check if the current level is finished.
     * @returns {boolean} true or false, if the Ball is inside the Finish
     */
    isLevelFinished() {
        return this.board.finish?.isCircleInside(this.board.ball.position, this.board.ball.radius, 0.5);
    }

    /**
     * Check if the game is finished.
     * @returns {boolean} true or false, if the game is finished
     */
    isGameFinished() {
        return this.level > this.maxLevel;
    }

    /**
     * Update the stopwatchs current time.
     * @param {number} timeDifference Time that passed since the last simulate() call
     */
    updateStopwatch(timeDifference) {
        // update value
        this.stopwatch += timeDifference;

        // update ui
        this.stopwatchElement.textContent = Utility.formatTime(this.stopwatch);
    }
}