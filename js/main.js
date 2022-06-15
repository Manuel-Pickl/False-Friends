/*
  sources:
  - geeksforgeeks.org: sensor data
  - stackoverflow: small programming specific things
  - developer.mozilla.org: sensor data
  - w3schools: inheritance
  - tutorialspoint

  
    more specific:
    - https://www.geeksforgeeks.org/javascript-math-sin-method/
*/


const debug = false;
const fps = 120;
var currentTimestamp;
var lastTimestamp = Date.now();

var simulation;
var windowManager = new WindowManager();
var rank;

// localStorage.clear();
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
  windowManager.hideHighscores();
  startGame();
}


// looping function
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
    && windowManager.currentWindow == null) {
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

    windowManager.showResults(time, rank);
  }

  lastTimestamp = currentTimestamp;
}, 1000 / fps);



function saveEntry() {
  let name = document.querySelector("#name").value;
  let time = simulation.stopwatch;

  // add highscore data at correct rank position
  highscores.splice(rank - 1, 0, {name, time});

  // build table from list variable
  const table = document.querySelector("table");
  table.innerHTML = "";
  
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

    table.appendChild(row);
  }

  // persistent save of players data
  localStorage.setItem("highscores", JSON.stringify(highscores));;

  // change panel
  windowManager.hideResults();
  windowManager.showHighscores();
}

function onSensorChanged(event) {
  // get board angle from "device orientation" event
  let boardAngle = new Point(event.gamma, event.beta);

  // set board angles
  simulation.board.setAngle(boardAngle);
}