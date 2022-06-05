class Ball {
    domElement;
    radius;

    positionX; positionY;
    velocityX; velocityY;

    constructor() {
        this.domElement = document.querySelector(".ball");
        this.positionX = window.innerWidth / 2;
        this.positionY = window.innerHeight / 2;
        this.velocityX = 0;
        this.velocityY = 0;

        // size
        this.radius = 20;
        this.domElement.style.width = `${this.radius * 2}px`;
        this.domElement.style.height = `${this.radius * 2}px`;
    }

    computePhysics(sensorX, sensorY, timeDifference) {
        // acceleration
        let acceleration = this.calculateAcceleration(sensorX, sensorY);
        
        // velocity
        let deltaVelocity = this.calculateDeltaVelocity(acceleration);
        this.setVelocity(deltaVelocity);
        
        // distance
        let deltaDistance = this.calculateDistance(acceleration, timeDifference);
        this.setPos(deltaDistance)
    }

    calculateAcceleration() {
        /*
            source: https://www.rapidtables.com/convert/number/degrees-to-radians.html
        */
        let radianX = sensorX * Math.PI/180;
        let radianY = sensorY * Math.PI/180;


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
        const resistance = 0.005;
        if (this.velocityY >= resistance) {
            this.velocityY -= resistance;
        }
        else if (this.velocityY <= -resistance) {
            this.velocityY += resistance;
        }
        else {
            this.velocityY = 0;
        }
        
        if (this.velocityX >= resistance) {
            this.velocityX -= resistance;
        }
        else if (this.velocityX <= -resistance) {
            this.velocityX += resistance;
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


    draw() {
        this.domElement.style.left = `${this.positionX}px`;
        this.domElement.style.top = `${this.positionY}px`;
    }
}