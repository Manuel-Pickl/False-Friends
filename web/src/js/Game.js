/**
 * Main Game interacting with the index.html and distribute work to Simulation, Board & ModalManager 
 */
 class Game {
    debug;
    currentTimestamp;
    lastTimestamp;
  
    simulation;
    
    modalManager;
    leaderboardManager;
    mqttManager
  
    constructor() {
      this.debug = false;
      this.currentTimestamp;
      this.lastTimestamp = Date.now();
  
      this.simulation = new Simulation();
      this.modalManager = new ModalManager();
      this.leaderboardManager = new LeaderboardManager();
      this.mqttManager = new MQTTManager();
  
      // game startup
      // load highscore data
      // this.leaderboardManager.clear();
      this.leaderboardManager.deserialize();
      this.modalManager.updateLeaderboard(this.leaderboardManager.leaderboard);
  
      this.showStartMenu();
  
      // add event listener on device orientation change
      window.addEventListener('deviceorientation', this.onSensorChanged.bind(this));

      // set the main game running loop with set fps
      setInterval(
        this.run.bind(this),
        1000 / fps
      );
    }

    /**
     * Main function that runs the game.  
     * Has to be called in an interval.
     */
    run() {
        // set board angles from mqtt if subscribed
        if (this.mqttManager.subscribed) {
          this.setBoardAnglesFromMQTT();
        }
    
        this.currentTimestamp = Date.now();
        let timeDifference = (this.currentTimestamp - this.lastTimestamp) / 1000;
    
        // on game running
        if (this.simulation.running) {
            this.simulation.simulate(timeDifference);
    
            // on level finish
            if (this.simulation.isLevelFinished()) {
              this.mqttManager.publishMessage(String(this.simulation.level));
              this.simulation.finishLevel();
            }
        }
        // on game finish
        else if (
          this.simulation.isGameFinished()
          && this.modalManager.currentModal == null) {
            
          this.mqttManager.publishMessage("green");
          
          // get highscore data
          let time = this.simulation.stopwatchToString();
          let rank = this.leaderboardManager.calculateRank(time);
      
          this.modalManager.showResults(time, rank);
        }
    
        this.lastTimestamp = this.currentTimestamp;
    }

  
    /**
     * Show the start menu of the game
     */
    showStartMenu() {
      this.modalManager.showStartMenu();
    
      // reset simulation and place ball
      this.simulation.initialize();
      this.simulation.board.placeBall(new Point(Utility.canvas.clientWidth * 0.5, Utility.canvas.clientHeight * 0.8));
      this.simulation.resume();
    }
    
    /**
     * Start the Game
     */
    startGame() {
        // hide start menu and start simulation
        this.modalManager.hideStartMenu();
        this.simulation.initialize().start();
    }
    
    /**
     * Restart the Game
     */
    restartGame() {
        this.modalManager.hideModal();
      
        this.startGame();
    }
    
    /**
     * Pause the Game and enter the pause menu
     */
    pauseGame() {
        // don't allow pause on level finish animation or in result screen
        if (!this.simulation.running) {
            return;
        }
        
        // pause game and show pause menu
        this.simulation.pause();
        this.modalManager.showPause();
    }
    
    /**
     * Resume the Game from the pause menu
     */
    resumeGame() {
      this.modalManager.hideModal();
      this.simulation.resume();
    }
    
    /**
     * Show the leaderboard
     * @param {string} mode The display mode for the leaderboard. Possible modes are "back" and "finish"
     */
    showLeaderboard(mode) {
      this.modalManager.showLeaderboard(mode);
    }
    
    /**
     * Show the settings
     */
    showSettings() {
      this.modalManager.showSettings();
    }
    
    /**
     * Open the last viewed menu
     */
    back() {
      this.modalManager.back();
    }
  
    /**
     * Add the current highscore to the leaderboard and open the leaderboard
     */
    addToLeaderboard() {
      // get current highscore data
      let name = document.querySelector("#name").value;
      let time = this.simulation.stopwatch;
    
      // update leaderboard data
      this.leaderboardManager.update(name, time);
    
      // update leaderboard ui
      this.modalManager.updateLeaderboard(this.leaderboardManager.leaderboard);  
    
      // open leaderboard
      this.showLeaderboard("finish");
    }
    
    /**
     * Show the help menu
     */
    showHelp() {
        this.modalManager.showHelp();
    }
    
    /**
     * Gets triggered on device orientation change and sets the new angles on the board.
     * @param {DeviceOrientationEvent} event The event that contains the device orientation data
     */
    onSensorChanged(event) {
      // get board angle from "device orientation" event
      let boardAngle = new Point(event.gamma, event.beta);
    
      // set board angles
      this.simulation.board.setAngle(boardAngle);
    }
    
    /**
     * Set the board angles from the mqtt orientation data from the broker.
     */
    setBoardAnglesFromMQTT() {
      // get raspberry pi angle from mqtt broker
      let normalizedAngles = this.mqttManager.message.split(",");
      let gamma = normalizedAngles[1] * -90;
      let beta = normalizedAngles[0] * 90;
    
      let boardAngle = new Point(gamma, beta);
    
      // set board angles
      this.simulation.board.setAngle(boardAngle);
    }
    
    /**
     * Toggle the background music of the Game.
     * @param {input} checkbox The checkbox, whose value decides if music is played
     */
    toggleMusic(checkbox) {
        // get audio element and play/pause depending on checkbox
        if (checkbox.checked) {
            document.querySelector("audio").play();
        }
        else {
            document.querySelector("audio").pause();
        }
    }
    
    /**
     * Toggle the remote control from the broker
     * @param {input} checkbox The checkbox, whose value decides if remote control is turned on
     */
    toggleRemoteControl(checkbox) {
      if (checkbox.checked) {
        // subscribe to broker
        this.mqttManager.subscribe();
        
        // forbid remote control if no broker subscription exists
        if (!this.mqttManager.subscribed) {
          checkbox.checked = false;
        }
        // otherwise disable the sensor event of the device itself
        else {
          window.removeEventListener('deviceorientation', this.onSensorChanged);
        }
      }
      else {
        // activate sensor events and unsubscibe from broker
        window.addEventListener('deviceorientation', this.onSensorChanged);
        this.mqttManager.unsubscribe();
      }
    }
    
    /**
     * Connect to broker at given ip address
     */
    connect() {
      const ipInput = document.querySelector(".modal .settings #ip");
      this.mqttManager.connect(ipInput.value);
    }
  }