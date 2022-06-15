/*
  sources:
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

var simulation;
var modalManager = new ModalManager();
var rank;

localStorage.clear();
var highscores = JSON.parse(localStorage.getItem("highscores"));
if (!highscores) {
  highscores = [];
}

startGame();


function startGame() {
  simulation = new Simulation()
    .initialize()
    .start();
}

function restartGame() {
  modalManager.hideModal();

  startGame();
}

function pauseGame() {
  simulation.stop();
  modalManager.showPause();
}

function resumeGame() {
  modalManager.hideModal();
  simulation.start();
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
    && modalManager.currentWindow == null) {
    // get time
    let time = simulation.stopwatchToString();
        
    // calculate rank
    rank = 1;
    let rankDetermined = false;
    while (!rankDetermined && rank <= highscores.length) {
        // if current time is better than highscore on rank x
      if (simulation.stopwatch < highscores[rank - 1].time) {
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


function showResults() {
  // save current highscore data
  let name = document.querySelector("#name").value;
  let time = simulation.stopwatch;

  // add highscore data at correct rank position
  highscores.splice(rank - 1, 0, {name, time});

  // persistent save of players data
  localStorage.setItem("highscores", JSON.stringify(highscores));

  // built table rows from data
  let rows = [];
  
  for (let i = 0; i < highscores.length; i++) {
    let rank = i + 1;
    let name = highscores[i].name;
    let time = highscores[i].time;
    
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
  
  // open modal with data
  modalManager.showHighscores(rows);
}

function onSensorChanged(event) {
  // get board angle from "device orientation" event
  let boardAngle = new Point(event.gamma, event.beta);

  // set board angles
  simulation.board.setAngle(boardAngle);
}