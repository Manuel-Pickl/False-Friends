/*
  sources:
  - youtube
  - geeksforgeeks.org: sensor data
  - stackoverflow: small programming specific things
  - developer.mozilla.org: sensor data
  - w3schools: inheritance
  - tutorialspoint
  - fontawesome.com

  
    more specific:
    - https://www.geeksforgeeks.org/javascript-math-sin-method/
*/


const debug = false;
const fps = 120;
var currentTimestamp;
var lastTimestamp = Date.now();

var simulation = new Simulation().initialize();
var modalManager = new ModalManager();
var leaderboardManager = new LeaderboardManager();
var mqttManager = new MQTTManager();



// game startup
// this.leaderboardManager.clear();
this.leaderboardManager.deserialize();
this.modalManager.updateLeaderboard(this.leaderboardManager.leaderboard);

showStartMenu();

window.addEventListener('deviceorientation', onSensorChanged);






function showStartMenu() {
  this.modalManager.showStartMenu();

  this.simulation.initialize();
  this.simulation.board.placeBall(new Point(Utility.canvas.clientWidth * 0.5, Utility.canvas.clientHeight * 0.8));
  this.simulation.resume();
}



function startGame() {
  modalManager.hideStartMenu();

  simulation.initialize().start();
}

function restartGame() {
  modalManager.hideModal();
  
  startGame();
}

function pauseGame() {
  if (!this.simulation.running) {
    return;
  }

  this.simulation.pause();
  this.modalManager.showPause();
}

function resumeGame() {
  this.modalManager.hideModal();
  this.simulation.resume();
}

function showLeaderboard(mode) {
  this.modalManager.showLeaderboard(mode);
}

function showSettings() {
  this.modalManager.showSettings();
}

function back() {
  this.modalManager.back();
}

// main game looping function
setInterval(function() {
  // set board angles from mqtt if subscribed
  if (this.mqttManager.subscribed) {
    this.setBoardAnglesFromMQTT();
  }

  currentTimestamp = Date.now();
  let timeDifference = (currentTimestamp - this.lastTimestamp) / 1000;

  if (simulation.running) {
    simulation.simulate(timeDifference);

    if (simulation.isLevelFinished()) {
      simulation.finishLevel();
    }
  }
  else if (
    simulation.isGameFinished()
    && modalManager.currentModal == null) {
    // get values
    let time = simulation.stopwatchToString();
    let rank = leaderboardManager.calculateRank(time);

    modalManager.showResults(time, rank);
  }

  lastTimestamp = currentTimestamp;
}, 1000 / fps);


function addToLeaderboard() {
  // get current highscore data
  let name = document.querySelector("#name").value;
  let time = simulation.stopwatch;

  // update leaderboard data
  this.leaderboardManager.update(name, time);

  // update leaderboard ui
  this.modalManager.updateLeaderboard(this.leaderboardManager.leaderboard);  

  // open leaderboard
  this.showLeaderboard("finish");
}

function showLeaderboard(mode) {
  modalManager.showLeaderboard(mode);
}

function showHelp() {
  modalManager.showHelp();
}

function onSensorChanged(event) {
  // get board angle from "device orientation" event
  let boardAngle = new Point(event.gamma, event.beta);

  // set board angles
  simulation.board.setAngle(boardAngle);
}

function setBoardAnglesFromMQTT() {
  // get raspberry pi angle from mqtt borker
  let angles = this.mqttManager.message.split(",");
  let gamma = angles[1];
  let beta = angles[2];

  let boardAngle = new Point(gamma, beta);

  // set board angles
  simulation.board.setAngle(boardAngle);
}


function toggleMusic(checkbox) {
  if (checkbox.checked) {
    document.querySelector("audio").play();
  }
  else {
    document.querySelector("audio").pause();
  }
}

function toggleRemoteControl(checkbox) {
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

function connect() {
  const ipInput = document.querySelector(".modal .settings #ip");
  this.mqttManager.connect(ipInput.value);
}