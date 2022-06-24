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
  
      this.simulation = new Simulation().initialize();
      this.modalManager = new ModalManager();
      this.leaderboardManager = new LeaderboardManager();
      this.mqttManager = new MQTTManager();
  
  
  
      // game startup
      // this.leaderboardManager.clear();
      this.leaderboardManager.deserialize();
      this.modalManager.updateLeaderboard(this.leaderboardManager.leaderboard);
  
      this.showStartMenu();
  
      window.addEventListener('deviceorientation', this.onSensorChanged.bind(this));

      setInterval(
        this.run.bind(this),
        1000 / fps
      );
    }

    // main game looping function
    run() {
        // set board angles from mqtt if subscribed
        if (this.mqttManager.subscribed) {
        this.setBoardAnglesFromMQTT();
        }
    
        this.currentTimestamp = Date.now();
        let timeDifference = (this.currentTimestamp - this.lastTimestamp) / 1000;
    
        if (this.simulation.running) {
            this.simulation.simulate(timeDifference);
    
        if (this.simulation.isLevelFinished()) {
            this.simulation.finishLevel();
        }
        }
        else if (
            this.simulation.isGameFinished()
            && this.modalManager.currentModal == null) {
        // get values
        let time = this.simulation.stopwatchToString();
        let rank = this.leaderboardManager.calculateRank(time);
    
        this.modalManager.showResults(time, rank);
        }
    
        this.lastTimestamp = this.currentTimestamp;
    }

  
    showStartMenu() {
      this.modalManager.showStartMenu();
    
      this.simulation.initialize();
      this.simulation.board.placeBall(new Point(Utility.canvas.clientWidth * 0.5, Utility.canvas.clientHeight * 0.8));
      this.simulation.resume();
    }
    
    startGame() {
        this.modalManager.hideStartMenu();
    
        this.simulation.initialize().start();
    }
    
    restartGame() {
        this.modalManager.hideModal();
      
      this.startGame();
    }
    
    pauseGame() {
      if (!this.simulation.running) {
        return;
      }
    
      this.simulation.pause();
      this.modalManager.showPause();
    }
    
    resumeGame() {
      this.modalManager.hideModal();
      this.simulation.resume();
    }
    
    showLeaderboard(mode) {
      this.modalManager.showLeaderboard(mode);
    }
    
    showSettings() {
      this.modalManager.showSettings();
    }
    
    back() {
      this.modalManager.back();
    }
  
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
    
    showLeaderboard(mode) {
        this.modalManager.showLeaderboard(mode);
    }
    
    showHelp() {
        this.modalManager.showHelp();
    }
    
    onSensorChanged(event) {
      // get board angle from "device orientation" event
      let boardAngle = new Point(event.gamma, event.beta);
    
      // set board angles
      this.simulation.board.setAngle(boardAngle);
    }
    
    setBoardAnglesFromMQTT() {
      // get raspberry pi angle from mqtt borker
      let angles = this.mqttManager.message.split(",");
      let gamma = angles[1];
      let beta = angles[2];
    
      let boardAngle = new Point(gamma, beta);
    
      // set board angles
      this.simulation.board.setAngle(boardAngle);
    }
    
    
    toggleMusic(checkbox) {
      if (checkbox.checked) {
        document.querySelector("audio").play();
      }
      else {
        document.querySelector("audio").pause();
      }
    }
    
    toggleRemoteControl(checkbox) {
      if (checkbox.checked) {
        this.mqttManager.subscribe();
        
        if (!this.mqttManager.subscribed) {
          checkbox.checked = false;
        }
        else {
          window.removeEventListener('deviceorientation', onSensorChanged);
        }
      }
      else {
        window.addEventListener('deviceorientation', onSensorChanged);
        this.mqttManager.unsubscribe();
      }
    }
    
    connect() {
      const ipInput = document.querySelector(".modal .settings #ip");
      this.mqttManager.connect(ipInput.value);
    }
  }