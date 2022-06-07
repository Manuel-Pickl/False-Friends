class Ball extends Particle {
    velocity;
    craters;

    constructor(startPosition, radius, craters) {
        super(startPosition, radius);
        
        this.domElement.classList.add("ball");
        this.craters = craters;
        this.velocity = new Point();
    }

    computePhysics(boardAngle, timeDifference) {
        // include crater angle at current position
        boardAngle = this.includeCraterAngles(boardAngle);
        // acceleration
        let acceleration = this.calculateAcceleration(boardAngle);
        
        // velocity
        let deltaVelocity = this.calculateDeltaVelocity(acceleration);
        this.setVelocity(deltaVelocity);
        
        // distance
        let deltaDistance = this.calculateDistance(acceleration, timeDifference);
        this.setPos(deltaDistance)
    }

    includeCraterAngles(boardAngle) {
        // check for each crater, if ball is inside
        this.craters.forEach(crater => {
            if (!crater.isPointInside(this.position)) {
                return;
            }
            
            let craterAngle = crater.getAngleAtPoint(this.position);

            // add crater angle to board angle
            boardAngle.x += craterAngle.x;
            boardAngle.y += craterAngle.y;
        });
        
        return boardAngle;
    }

    calculateAcceleration(boardAngle) {
        /*
            source: https://www.rapidtables.com/convert/number/degrees-to-radians.html
        */
        let radianX = boardAngle.x * Math.PI/180;
        let radianY = boardAngle.y * Math.PI/180;


        /*
        source: https://www.lernhelfer.de/schuelerlexikon/physik/artikel/fallbeschleunigung
        */
        let g = 9.81; // earth
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

    calculateDeltaVelocity(acceleration) {
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



    setPos(deltaDistance) {
        // ###
        const fieldHeight = 20;
        const fieldWidth = window.innerWidth / window.innerHeight * fieldHeight;

        let ratioX = deltaDistance.x / fieldWidth;
        let deltaX = ratioX * window.innerWidth;
        this.position.x += deltaX;

        let ratioY = deltaDistance.y / fieldHeight;
        let deltaY = ratioY * window.innerHeight;
        this.position.y += deltaY;
    }



    
    resolveCollisionWithBounds() {
        // add & subtract radius to prevent clipping
        let yMax = window.innerHeight - this.radius;
        let yMin = this.radius;
        let xMax = window.innerWidth - this.radius;
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