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

  lastTimestamp = currentTimestamp;
}, 1000 / fps);


function onSensorChanged(event) {
  // get board angle from "device orientation" event
  let boardAngle = new Point(event.gamma, event.beta);

  // set board angles
  simulation.board.setAngle(boardAngle);
}