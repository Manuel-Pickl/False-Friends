class Ball {
    domElement;
    posY;
    speedY;
    speedX;

    constructor() {
        this.domElement = document.querySelector(".ball");
        this.setPosX(window.innerWidth/2);
        this.setPosY(window.innerHeight/2);
        this.speedX = 0;
        this.speedY = 0;
    }

    setPosX(posX) {
        // check for collision
        if (posX > window.innerWidth || posX < 0) {
            this.setSpeedX(0);
            return;
        }

        this.posX = posX;
        
        // add unit (px) and set value
        this.domElement.style.left = `${this.posX}px`;
    }
    setPosY(posY) {
        // check for collision
        if (posY > window.innerHeight || posY < 0) {
            this.setSpeedY(0);
            return;
        }

        this.posY = posY;
        
        // add unit (px) and set value
        this.domElement.style.top = `${this.posY}px`;
    }

    setSpeedX(speedX) {
        this.speedX = speedX;
        
        // speed limit
        if (this.speedX > speedLimit) {
            this.speedX = speedLimit;
        }
        else if (this.speedX < -speedLimit) {
            this.speedX = -speedLimit;    
        }
    }
    setSpeedY(speedY) {
        this.speedY = speedY;
        
        // speed limit
        if (this.speedY > speedLimit) {
            this.speedY = speedLimit;
        }
        else if (this.speedY < -speedLimit) {
            this.speedY = -speedLimit;    
        }
    }
    
    update() {
        this.calcSpeed();
        this.calcPos();
    }

    calcSpeed() {
        // always keep value in range of [-90;90]
        let normalizedY = y / 90;
        let normalizedX = x / 90;
        
        let accelerationX = normalizedX * gravitation;
        let accelerationY = normalizedY * gravitation;

        let speedX = this.speedX + accelerationX
        let speedY = this.speedY + accelerationY

        this.setSpeedX(speedX);
        this.setSpeedY(speedY);
    }

    calcPos() {
        let newPosX = this.posX + this.speedX;
        this.setPosX(newPosX);

        let newPosY = this.posY + this.speedY;
        this.setPosY(newPosY);
    }
}