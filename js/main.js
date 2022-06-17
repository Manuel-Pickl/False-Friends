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


// const debug = false;
const debug = false;
const fps = 120;
var currentTimestamp;
var lastTimestamp = Date.now();

var simulation = new Simulation().initialize();
var modalManager = new ModalManager();
var leaderboardManager = new LeaderboardManager();
var rank;



// this.leaderboardManager.clear();
this.leaderboardManager.deserialize();
this.modalManager.updateLeaderboard(this.leaderboardManager.leaderboard);



showStartMenu();



function showStartMenu() {
  modalManager.showStartMenu();

  simulation.initialize();
  simulation.board.placeBall(new Point(Utility.canvas.clientWidth * 0.5, Utility.canvas.clientHeight * 0.8));
  simulation.resume();
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
  simulation.pause();
  modalManager.showPause();
}

function resumeGame() {
  modalManager.hideModal();
  simulation.resume();
}

function showLeaderboard() {
  modalManager.showLeaderboard();
}

function showSettings() {
  modalManager.showSettings();
}

function back() {
  modalManager.back();
}

// main game looping function
setInterval(function() {
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
  this.showLeaderboard();
}

function showLeaderboard() {
  modalManager.showLeaderboard();
}

function onSensorChanged(event) {
  // get board angle from "device orientation" event
  let boardAngle = new Point(event.gamma, event.beta);

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