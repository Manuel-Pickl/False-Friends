/*
  sources:
  - geeksforgeeks.org
  - stackoverflow
  - developer.mozilla.org
  - w3schools

  
    more specific:
    - https://www.geeksforgeeks.org/javascript-math-sin-method/
*/

// window.addEventListener('click', e => {
//     window.addEventListener('devicemotion', event => {
//         console.log("accelerationIncludingGravity.x: " + event.accelerationIncludingGravity.x);
//         console.log("accelerationIncludingGravity.y: " + event.accelerationIncludingGravity.y);
//         console.log("acceleration.x: " + event.acceleration.x);
//         console.log("acceleration.y: " + event.acceleration.y);
//         console.log(event.rotationRate);
//     }, true);
// })


const gravitation = 0.1;
const speedLimit = 10;
var sensorX = 0, sensorY = 0;

const fps = 120;

var crater = new Crater().draw();

let startPositionX = window.innerWidth / 2;
let startPositionY = window.innerHeight / 2;
var ball = new Ball({x: startPositionX, y: startPositionY}, [crater]);
var lastTimestamp = 0;



function startSimulation() {
  window.addEventListener('deviceorientation', onSensorChanged);
}

function stopSimulation() {
  window.removeEventListener('deviceorientation');
}

function onSensorChanged(event) {
  sensorX = event.gamma;
  sensorY = event.beta;
}


startSimulation();
setInterval(function() {
  simulate();
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

/*
  * Update the position of each particle in the system using the
  * Verlet integrator.
  */
var craterEntered = false;
function calculatePosition() {
  let currentTimestamp = Date.now();
  
  if (lastTimestamp != 0) {
    timeDifference = (currentTimestamp - lastTimestamp) / 1000;

    // calculate crater physics
    let gamma = sensorX;
    let beta = sensorY;

    
    // console.log({beta});
    ball.computePhysics(gamma, beta, timeDifference);
  }
  lastTimestamp = currentTimestamp;
}