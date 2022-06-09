/*
  sources:
  - geeksforgeeks.org: sensor data
  - stackoverflow: small programming specific things
  - developer.mozilla.org: sensor data
  - w3schools: inheritance

  
    more specific:
    - https://www.geeksforgeeks.org/javascript-math-sin-method/
*/


// initialization
const debug = true;
const fps = 120;
var simulation = new Simulation();

// starting game
simulation.startLevel();
simulation.startSimulation();


// looping function
setInterval(function() {
  if (simulation.running) {
    simulation.simulate();

    if (simulation.isLevelFinished()) {
      simulation.finishLevel();
    }
  }
}, 1000 / fps);


function onSensorChanged(event) {
  // get board angle from "device orientation" event
  let boardAngle = new Point(event.gamma, event.beta);

  // set board angles
  simulation.board.setAngle(boardAngle);
}