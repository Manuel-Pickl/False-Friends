/*
  sources:
  - geeksforgeeks.org: sensor data
  - stackoverflow: small programming specific things
  - developer.mozilla.org: sensor data
  - w3schools: inheritance

  
    more specific:
    - https://www.geeksforgeeks.org/javascript-math-sin-method/
*/


// simulation
var simulationRunning = false;
const fps = 120;
const maxAngle = 90;
const maxAngleUsed = 35;
var sensorX = 0, sensorY = 0;

// crater
let craterPosX = window.innerWidth / 2 + 100;
let craterPosY = window.innerHeight / 2 + 150;
var crater = new Crater({x: craterPosX, y: craterPosY}).draw();

// ball
let startPositionX = window.innerWidth / 2;
let startPositionY = window.innerHeight / 2;
var ball = new Ball({x: startPositionX, y: startPositionY}, [crater]);
var lastTimestamp = 0;



function startSimulation() {
  window.addEventListener('deviceorientation', onSensorChanged);
  simulationRunning = true;
}

function stopSimulation() {
  window.removeEventListener('deviceorientation');
  simulationRunning = false;
}

function onSensorChanged(event) {
  sensorX = event.gamma;
  sensorY = event.beta;

  // just use sensors till specific angle,
  // because nobody wants to tilt their phone till 90°
  let multiplicator = maxAngle / maxAngleUsed;

  sensorX *= multiplicator;
  sensorX = sensorX > maxAngle ? maxAngle : sensorX;

  sensorY *= multiplicator;
  sensorY = sensorY > maxAngle ? maxAngle : sensorY;
}


startSimulation();

setInterval(function() {
  if (simulationRunning) {
    simulate();
  }
}, 1000 / fps);




function simulate() {
  /*
    * Compute the new position of our object, based on accelerometer
    * data and present time.
    */
   
   // update the system's positions
  calculatePosition();

  // handle collisions
  ball.resolveCollisionWithBounds();

  ball.draw();
}



function calculatePosition() {
  let currentTimestamp = Date.now();
  
  if (lastTimestamp != 0) {
    timeDifference = (currentTimestamp - lastTimestamp) / 1000;

    ball.computePhysics(sensorX, sensorY, timeDifference);
  }

  lastTimestamp = currentTimestamp;
}