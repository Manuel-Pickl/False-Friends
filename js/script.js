/*
  sources:
  - geeksforgeeks.org: sensor data
  - stackoverflow: small programming specific things
  - developer.mozilla.org: sensor data
  - w3schools: inheritance

  
    more specific:
    - https://www.geeksforgeeks.org/javascript-math-sin-method/
*/


const fps = 120;
const maxAngle = 90;

var simulation = new Simulation(fps);
startLevel(1);
startSimulation();



function startLevel(difficulty) {
  // set level-dependend quanitity of craters in random positions
  let craterCount = 10; // get value out of dict
  simulation.placeCraters(craterCount);

  simulation.placeBall();
}



function startSimulation() {
  simulation.running = true;
  window.addEventListener('deviceorientation', onSensorChanged);
}

function stopSimulation() {
  simulation.running = false;
  window.removeEventListener('deviceorientation');
}


setInterval(function() {
  if (simulation.running) {
    simulation.simulate();
  }
}, 1000 / simulation.fps);


function onSensorChanged(event) {
  simulation.boardAngle.x = event.gamma;
  simulation.boardAngle.y = event.beta;

  // just use sensors till specific angle,
  // because nobody wants to tilt their phone till 90°
  let multiplicator = maxAngle / simulation.maxAngleUsed;

  simulation.boardAngle.x *= multiplicator;
  simulation.boardAngle.x = simulation.boardAngle.x > maxAngle ? maxAngle : simulation.boardAngle.x;

  simulation.boardAngle.y *= multiplicator;
  simulation.boardAngle.y = simulation.boardAngle.y > maxAngle ? maxAngle : simulation.boardAngle.y;
}