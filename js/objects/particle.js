class Particle {
    domElement;
    radius;
    positionX;
    positionY;

    constructor(startPosition, radius) {
        // set starting coordinates
        this.positionX = startPosition.x;
        this.positionY = startPosition.y;
        
        // create dom element
        this.domElement = document.createElement("div");
        this.domElement.className = "particle";
        // append it to dom
        document.getElementsByTagName("main")[0].appendChild(this.domElement);
        
        // set radius
        this.radius = radius;
        // apply radius to dom element
        this.domElement.style.width = `${this.radius * 2}px`;
        this.domElement.style.height = `${this.radius * 2}px`;
    }

    draw() {
        this.domElement.style.left = `${this.positionX}px`;
        this.domElement.style.top = `${this.positionY}px`;

        return this;
    }
}