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
var entries = new Map();



// initialization & starting of game
var simulation = new Simulation().startGame();


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
  else if (simulation.isGameFinished()) {
    console.log("F");
    document.querySelector(".end-screen").style.visibility = "visible";
  }

  lastTimestamp = currentTimestamp;
}, 1000 / fps);

function saveEntry() {
  let name = document.querySelector("#name").value;
  let time = simulation.stopwatch % 60;

  // get position
  // do something...

  // update list
  entries.set(1, {name, time});

  // build table from list variable
  const table = document.querySelector("table");
  table.innerHTML = "";
  
  for (const [key, value] of entries.entries()) {
    let rank = key;
    let name = value.name;
    let time = value.time;
    
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

  
  // document.createElement("tr");
  // document.createElement("td");


  // change panel
  document.querySelector(".finished").style.visibility = "hidden";
  document.querySelector(".highscores").style.visibility = "visible";
}

function onSensorChanged(event) {
  // get board angle from "device orientation" event
  let boardAngle = new Point(event.gamma, event.beta);

  // set board angles
  simulation.board.setAngle(boardAngle);
}