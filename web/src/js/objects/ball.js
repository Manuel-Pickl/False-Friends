/**
 * Sensor controlled Ball which needs to reach the finish
 * @extends Particle
 */
class Ball extends Particle {
    velocity;
    craters;
    originalRadius;

    /**
     * Create a Ball at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Ball
     * @param {number} radius Radius of the Ball
     * @param {Crater[]} craters Array of Craters currently on the board
     */
    constructor(startPosition, radius, craters) {
        super(startPosition, radius);
        
        this.domElement.classList.add("ball");
        this.craters = craters;
        this.velocity = new Point();
        this.originalRadius = radius;
    }

    /**
     * Compute the physics of the Ball by the angle at its current position and calculate its new position.
     * 
     * @param {Point} boardAngle X and Y angles of the Board at the ball's current position
     * @param {float} timeDifference Time that passed since the last calculation of the balls phyics
     */
    computePhysics(boardAngle, timeDifference) {
        // include crater angle at current position
        let boardAngleModified = this.includeCraterAngles(boardAngle);

        // acceleration
        let acceleration = this.calculateAcceleration(boardAngleModified);
        
        // velocity
        let deltaVelocity = this.calculateDeltaVelocity(acceleration, timeDifference);
        this.setVelocity(deltaVelocity);
        
        // distance
        let deltaDistance = this.calculateDistance(acceleration, timeDifference);
        this.setPos(deltaDistance);
    }

    /**
     * Calculate the actual angle at the balls positions including craters
     * @param {Point} boardAngle X and Y angles of the Board at the ball's current position
     * @returns {Point} Actual angle at balls position including craters
     */
    includeCraterAngles(boardAngle) {
        let boardAngleModified = new Point(boardAngle.x, boardAngle.y);

        // check for each crater, if ball is inside
        this.craters.forEach(crater => {
            if (!crater.isPointInside(this.position)) {
                return;
            }
            
            let craterAngle = crater.getAngleAtPoint(this.position);

            // add crater angle to board angle
            boardAngleModified.x += craterAngle.x;
            boardAngleModified.y += craterAngle.y;

            // cap angle at 90°
            if (boardAngleModified.x > Physics.maxAngle) {
                boardAngleModified.x = Physics.maxAngle;
            }
            else if (boardAngleModified.x < -Physics.maxAngle) {
                boardAngleModified.x = -Physics.maxAngle;
            }

            if (boardAngleModified.y > Physics.maxAngle) {
                boardAngleModified.y = Physics.maxAngle;
            }
            else if (boardAngleModified.y < -Physics.maxAngle) {
                boardAngleModified.y = -Physics.maxAngle;
            }
        });
        
        return boardAngleModified;
    }

    /**
     * Calculate the balls acceleration with the angles at its current position
     * @param {Point} boardAngle X and Y angles of the Board at the ball's current position
     * @returns {Point} X and Y acceleration
     */
    calculateAcceleration(boardAngle) {
        /*
            source: https://www.rapidtables.com/convert/number/degrees-to-radians.html
        */
        let radianX = boardAngle.x * Math.PI/180;
        let radianY = boardAngle.y * Math.PI/180;


        /*
        source: https://www.lernhelfer.de/schuelerlexikon/physik/artikel/fallbeschleunigung
        */
        let g = Physics.gravitationalAccelerationEarth; // earth
        // let g = 3; // moon
        
        
        /*
            source: https://www.schule-bw.de/faecher-und-schularten/mathematisch-naturwissenschaftliche-faecher/physik/unterrichtsmaterialien/mechanik_2/bewegung/schiefe_ebene_kraefte.htm

            a = g * sin(alpha)
        */
        let accelerationX = g * Math.sin(radianX);
        let accelerationY = g * Math.sin(radianY);
        let acceleration = new Point(accelerationX, accelerationY);

        return acceleration;
    }

    /**
     * Calculate the balls velicity difference since the last calculation
     * @param {Point} acceleration The balls current acceleration
     * @param {float} timeDifference Time that passed since the last calculation of the balls phyics
     * @returns X and Y velocity change
     */
    calculateDeltaVelocity(acceleration, timeDifference) {
        /*
            source: https://www.frustfrei-lernen.de/mechanik/gleichmaessig-beschleunigte-bewegung-physik.html

            v = a · t + v0

            "v" ist die Geschwindigkeit in Meter pro Sekunde [m/s]
            "a" ist die Beschleunigung in Meter pro Sekunde-Quadrat [ m/s2 ]
            "t" ist die Zeit in Sekunden [s]
            "v0" ist die Anfangsgeschwindigkeit in Meter pro Sekunde [ m/s ]
        */
        let deltaVelocityX = acceleration.x * timeDifference;
        let deltaVelocityY = acceleration.y * timeDifference;
        let deltaVelocity = new Point(deltaVelocityX, deltaVelocityY);

        return deltaVelocity;
    }

    /**
     * Set the balls velocity by adding the velocity change and taking a maximum into account
     * @param {Point} deltaVelocity 
     */
    setVelocity(deltaVelocity) {
        this.velocity.x += deltaVelocity.x;
        this.velocity.y += deltaVelocity.y;
        
        // simulate resistances like friction, drag, etc.
        if (this.velocity.y >= Physics.resistance) {
            this.velocity.y -= Physics.resistance;
        }
        else if (this.velocity.y <= -Physics.resistance) {
            this.velocity.y += Physics.resistance;
        }
        else {
            this.velocity.y = 0;
        }
        
        if (this.velocity.x >= Physics.resistance) {
            this.velocity.x -= Physics.resistance;
        }
        else if (this.velocity.x <= -Physics.resistance) {
            this.velocity.x += Physics.resistance;
        }
        else {
            this.velocity.x = 0;
        }

        // cap velocity
        const maxVelocity = 30;
        if (this.velocity.y > maxVelocity) {
            this.velocity.y = maxVelocity;
        }
        if (this.velocity.x > maxVelocity) {
            this.velocity.x = maxVelocity;
        }
    }

    /**
     * Calculate the balls traveled distance from its acceleration since the last calculation
     * @param {Point} acceleration The balls current acceleration
     * @param {float} timeDifference Time that passed since the last calculation of the balls phyics
     * @returns {Point} X and Y distance
     */
    calculateDistance(acceleration, timeDifference) {
        /*
            source: https://www.frustfrei-lernen.de/mechanik/gleichmaessig-beschleunigte-bewegung-physik.html
            
            s = 0,5 · a · t^2 + vo · t + s0

            "s" ist die Strecke in Meter [m]
            "a" ist die Beschleunigung in Meter pro Sekunde-Quadrat [m/s2]
            "t" ist die Zeit in Sekunden [s]
            "s0" ist der Anfangsweg [m]
        */
        let deltaDistanceX = 0.5 * acceleration.x * timeDifference * timeDifference + this.velocity.x * timeDifference;
        let deltaDistanceY = 0.5 * acceleration.y * timeDifference * timeDifference + this.velocity.y * timeDifference;
        let deltaDistance = new Point(deltaDistanceX, deltaDistanceY);
        
        return deltaDistance;
    }

    /**
     * Set the balls new position based on its traveled distance
     * @param {Point} deltaDistance X and Y distance
     */
    setPos(deltaDistance) {
        // ###
        const fieldHeight = 20;
        const fieldWidth = Utility.canvas.clientWidth / Utility.canvas.clientHeight * fieldHeight;

        let ratioX = deltaDistance.x / fieldWidth;
        let deltaX = ratioX * Utility.canvas.clientWidth;
        this.position.x += deltaX;

        let ratioY = deltaDistance.y / fieldHeight;
        let deltaY = ratioY * Utility.canvas.clientHeight;
        this.position.y += deltaY;
    }

    /**
     * Resolve collisions with bounds like walls
     */
    resolveCollisionWithBounds() {
        // add & subtract radius to prevent clipping
        let yMax = Utility.canvas.clientHeight - this.radius;
        let yMin = this.radius;

        let xMax = Utility.canvas.clientWidth - this.radius;
        let xMin = this.radius
        
        if (this.position.y > yMax) {
            this.position.y = yMax;
            this.velocity.y = 0;
        } else if (this.position.y < yMin) {
            this.position.y = yMin;
            this.velocity.y = 0;
        }

        if (this.position.x > xMax) {
            this.position.x = xMax;
            this.velocity.x = 0;
        } else if (this.position.x < xMin) {
            this.position.x = xMin;
            this.velocity.x = 0;
        }
    }
}