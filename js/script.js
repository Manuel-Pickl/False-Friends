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
var level = 1;
var craterCountDict = {
  1: 0,
  2: 2,
  3: 5,
  4: 10
}

var simulation = new Simulation(fps);
startLevel(level);
startSimulation();



function startLevel(level) {
  // set level-dependend quanitity of craters in random positions
  let craterCount = craterCountDict[level]; // get value out of dict
  simulation.placeCraters(craterCount);

  simulation.placeFinish();
  
  simulation.placeBall();
}



function startSimulation() {
  simulation.running = true;
  window.addEventListener('deviceorientation', onSensorChanged);
}

function stopSimulation() {
  simulation.running = false;
  window.removeEventListener('deviceorientation', onSensorChanged);
}


setInterval(function() {
  if (simulation.running) {
    simulation.simulate();

    if (isLevelFinished()) {
      finishLevel();
    }
  }
}, 1000 / simulation.fps);

function isLevelFinished() {
  return simulation.finish.isCircleInside(simulation.ball.position, simulation.ball.radius);
}

function finishLevel() {
  stopSimulation();

  
  // increase level
  if (level < Object.keys(craterCountDict).length) {
    // reset ball velocity
    simulation.ball.velocity.x = 0;
    simulation.ball.velocity.y = 0;

    startLevel(++level);
    startSimulation();
  }
  else {
    alert("finito");
  }
}


function onSensorChanged(event) {
  let boardAngleX = event.gamma;
  let boardAngleY = event.beta;

  // just use sensors till specific angle,
  // because nobody wants to tilt their phone till 90°
  let multiplicator = maxAngle / simulation.maxAngleUsed;

  boardAngleX *= multiplicator;
  boardAngleY *= multiplicator;

  // cap angle at 90°
  if (boardAngleX > maxAngle) {
    boardAngleX = maxAngle;
  }
  else if (boardAngleX < -maxAngle) {
    boardAngleX = -maxAngle;
  }

  if (boardAngleY > maxAngle) {
    boardAngleY = maxAngle;
  }
  else if (boardAngleY < -maxAngle) {
    boardAngleY = -maxAngle;
  }

  simulation.boardAngle.x = boardAngleX;
  simulation.boardAngle.y = boardAngleY;
}