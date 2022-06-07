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

var boardAngle = new Point();

var craters = [];

const ballRadius = 20;
let startPosition = new Point(ballRadius, ballRadius)
var ball = new Ball(startPosition, ballRadius, craters);

var lastTimestamp = 0;

startLevel(1);
startSimulation();

/*
  source: https://www.w3schools.com/js/js_random.asp
*/
function getRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function startLevel(difficulty) {
  // set level-dependend quanitity of craters in random positions
  let craterCount = 10; // get value out of dict

  // clear previous craters
  craters.length = 0;

  // generate random non intersecting craters
  for (let i = 0; i < craterCount; i++) {
    // get random crater radius
    let craterRadius = getRandomIntegerInRange(ballRadius * 2, ballRadius * 4);
    
    let craterPosition;
    let craterIntersects;
    do {
      craterIntersects = false;

      // get random crater position
      let craterPositionX = getRandomIntegerInRange(0, window.innerWidth);
      let craterPositionY = getRandomIntegerInRange(0, window.innerHeight);
      craterPosition = new Point(craterPositionX, craterPositionY);

      // check intersection with other craters
      craters.forEach(crater => {
        let craterDistance = Math.sqrt(Math.pow(craterPosition.x - crater.position.x, 2) + Math.pow(craterPosition.y - crater.position.y, 2));
        if (craterDistance <= craterRadius + crater.radius) {
          craterIntersects = true;
        }
      });
    } while (craterIntersects);
    
    // intialize crater with generated data and draw
    let crater = new Crater(craterPosition, craterRadius).draw();
    
    // add crater to list
    craters.push(crater);
  }

  // place ball in random position not intersecting with craters
  let ballPosition;
  let craterIntersects;
  do {
    craterIntersects = false;

    // get random ball position
    ballPosition = new Point(
      getRandomIntegerInRange(ballRadius, window.innerWidth - ballRadius),
      getRandomIntegerInRange(ballRadius, window.innerHeight - ballRadius)
    );

    // check intersection with craters
    craters.forEach(crater => {
      if (crater.isPointInside(ballPosition)) {
        craterIntersects = true;
      }
    });
  } while (craterIntersects);
  
  ball.position = ballPosition;
}



function startSimulation() {
  window.addEventListener('deviceorientation', onSensorChanged);
  simulationRunning = true;
}

function stopSimulation() {
  window.removeEventListener('deviceorientation');
  simulationRunning = false;
}

function onSensorChanged(event) {
  boardAngle.x = event.gamma;
  boardAngle.y = event.beta;

  // just use sensors till specific angle,
  // because nobody wants to tilt their phone till 90°
  let multiplicator = maxAngle / maxAngleUsed;

  boardAngle.x *= multiplicator;
  boardAngle.x = boardAngle.x > maxAngle ? maxAngle : boardAngle.x;

  boardAngle.y *= multiplicator;
  boardAngle.y = boardAngle.y > maxAngle ? maxAngle : boardAngle.y;
}



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

    ball.computePhysics(boardAngle, timeDifference);
  }

  lastTimestamp = currentTimestamp;
}