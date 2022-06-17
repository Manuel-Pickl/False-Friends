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

var simulation;
var modalManager = new ModalManager();
var rank;

// localStorage.clear();
var leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
if (!leaderboard) {
  leaderboard = [];
}


simulation = new Simulation().initialize();
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
    // get time
    let time = simulation.stopwatchToString();
        
    // calculate rank
    rank = 1;
    let rankDetermined = false;
    while (!rankDetermined && rank <= leaderboard.length) {
        // if current time is better than highscore on rank x
      if (simulation.stopwatch < leaderboard[rank - 1].time) {
          rankDetermined = true;
        }
        else {
            rank++;
        }
    }

    modalManager.showResults(time, rank);
  }

  lastTimestamp = currentTimestamp;
}, 1000 / fps);


function addToLeaderboard(input) {
  // save current highscore data
  let name = document.querySelector("#name").value;
  let time = simulation.stopwatch;

  // add highscore data at correct rank position
  leaderboard.splice(rank - 1, 0, {name, time});

  // persistent save of players data
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // built table rows from data
  let rows = [];
  
  for (let i = 0; i < leaderboard.length; i++) {
    let rank = i + 1;
    let name = leaderboard[i].name;
    let time = leaderboard[i].time;
    
    let rankCell = document.createElement("td");
    rankCell.appendChild(document.createTextNode(`${rank}.`));
    let nameCell = document.createElement("td");
    nameCell.appendChild(document.createTextNode(name));
    let timeCell = document.createElement("td");
    timeCell.appendChild(document.createTextNode(`${time.toFixed(2)}`));
    
    let row = document.createElement("tr");
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(timeCell);

    rows.push(row);
  }

  // get leaderboard table
  let table = document.querySelector(".modal .leaderboard table");
  table.textContent = "";

  // append highscore rows at leaderboard
  rows?.forEach(row => table.appendChild(row));
  
  // open modal with data
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