class Ball {
    domElement;
    radius;

    positionX; positionY;
    velocityX; velocityY;

    craters;

    constructor(startPosition, craters) {
        this.positionX = startPosition.x;
        this.positionY = startPosition.y;
        this.craters = craters;
        
        this.domElement = document.querySelector(".ball");
        this.velocityX = 0;
        this.velocityY = 0;


        // size
        this.radius = 20;
        this.domElement.style.width = `${this.radius * 2}px`;
        this.domElement.style.height = `${this.radius * 2}px`;
    }

    computePhysics(sensorX, sensorY, timeDifference) {
        // get angles of current board position
        let ballAngles = this.calculateBallAngles(sensorX, sensorY);
        
        // acceleration
        let acceleration = this.calculateAcceleration(ballAngles);
        
        // velocity
        let deltaVelocity = this.calculateDeltaVelocity(acceleration);
        this.setVelocity(deltaVelocity);
        
        // distance
        let deltaDistance = this.calculateDistance(acceleration, timeDifference);
        this.setPos(deltaDistance)
    }

    calculateBallAngles(sensorX, sensorY) {
        this.craters.forEach(crater => {
            if (this.inCrater(crater)) {
                // Physics.resistance = 0.05;
                crater.domElement.style.backgroundColor = "orange";
        
                // add or subtract crater angle to board angle
                sensorX += this.positionX > crater.positionX ? -crater.depth : crater.depth;
                sensorY += this.positionY > crater.positionY ? -crater.depth : crater.depth;
                // case == 0 can be ignored
            }
            else {
                // Physics.resistance = 0.005;
                crater.domElement.style.backgroundColor = "grey";
            }
        });

        return {x: sensorX, y: sensorY};
    }

    calculateAcceleration(ballAngles) {
        /*
            source: https://www.rapidtables.com/convert/number/degrees-to-radians.html
        */
        let radianX = ballAngles.x * Math.PI/180;
        let radianY = ballAngles.y * Math.PI/180;


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

        return {x: accelerationX, y: accelerationY};
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

        return {x: deltaVelocityX, y: deltaVelocityY};
    }

    setVelocity(deltaVelocity) {
        this.velocityX += deltaVelocity.x;
        this.velocityY += deltaVelocity.y;
        
        // simulate resistances like friction, drag, etc.
        if (this.velocityY >= Physics.resistance) {
            this.velocityY -= Physics.resistance;
        }
        else if (this.velocityY <= -Physics.resistance) {
            this.velocityY += Physics.resistance;
        }
        else {
            this.velocityY = 0;
        }
        
        if (this.velocityX >= Physics.resistance) {
            this.velocityX -= Physics.resistance;
        }
        else if (this.velocityX <= -Physics.resistance) {
            this.velocityX += Physics.resistance;
        }
        else {
            this.velocityX = 0;
        }

        // cap velocity
        const maxVelocity = 30;
        if (this.velocityY > maxVelocity) {
            this.velocityY = maxVelocity;
        }
        if (this.velocityX > maxVelocity) {
            this.velocityX = maxVelocity;
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
        let deltaDistanceX = 0.5 * acceleration.x * timeDifference * timeDifference + this.velocityX * timeDifference;
        let deltaDistanceY = 0.5 * acceleration.y * timeDifference * timeDifference + this.velocityY * timeDifference;
        
        return {x: deltaDistanceX, y: deltaDistanceY};
    }



    setPos(deltaDistance) {
        // ###
        const fieldHeight = 20;
        const fieldWidth = window.innerWidth / window.innerHeight * fieldHeight;

        let ratioX = deltaDistance.x / fieldWidth;
        let deltaX = ratioX * window.innerWidth;

        let ratioY = deltaDistance.y / fieldHeight;
        let deltaY = ratioY * window.innerHeight;

        this.positionY += deltaY;
        this.positionX += deltaX;
    }



    
    resolveCollisionWithBounds() {
        // add & subtract radius to prevent clipping
        let yMax = window.innerHeight - this.radius;
        let yMin = this.radius;
        let xMax = window.innerWidth - this.radius;
        let xMin = this.radius
        
        if (this.positionY > yMax) {
            this.positionY = yMax;
            this.velocityY = 0;
        } else if (this.positionY < yMin) {
            this.positionY = yMin;
            this.velocityY = 0;
        }

        if (this.positionX > xMax) {
            this.positionX = xMax;
            this.velocityX = 0;
        } else if (this.positionX < xMin) {
            this.positionX = xMin;
            this.velocityX = 0;
        }
    }

    inCrater(crater) {
        /*
            source: https://lakschool.com/de/mathe/kreise-kugeln/lage-kreis-punkt

            (x0​ − xM​)^2 + (y0​ − yM​)^2 > r^2 -> außerhalb des Kreises

            P(x0​∣y0​) zum Mittelpunkt M(xM∣yM)
        */
        let inCrater = 
            (Math.pow(this.positionX - crater.positionX, 2) 
            + Math.pow(this.positionY - crater.positionY, 2)) 
            <= Math.pow(crater.radius, 2);

        return inCrater;
    }


    draw() {
        this.domElement.style.left = `${this.positionX}px`;
        this.domElement.style.top = `${this.positionY}px`;

        return this;
    }
}