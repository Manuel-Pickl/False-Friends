class Crater {
    domElement;
    radius;

    positionX; positionY;
    // depht;

    constructor() {
        this.domElement = document.querySelector(".crater");
        this.positionX = window.innerWidth / 2 + 100;
        this.positionY = window.innerHeight / 2 + 150;
        this.depth = 45; // in degrees

        // size
        this.radius = 50;
        this.domElement.style.width = `${this.radius * 2}px`;
        this.domElement.style.height = `${this.radius * 2}px`;
    }

    draw() {
        this.domElement.style.left = `${this.positionX}px`;
        this.domElement.style.top = `${this.positionY}px`;

        return this;
    }
}