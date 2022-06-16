class Particle {
    domElement;
    radius;
    position;

    constructor(startPosition, radius) {
        // set starting coordinates
        this.position = startPosition;
        
        // create dom element
        this.domElement = document.createElement("div");
        this.domElement.className = "particle";
        // append it to dom
        Utility.canvas.appendChild(this.domElement);
        
        // set radius
        this.setRadius(radius);
    }

    setRadius(radius) {
        this.radius = radius;

        // apply radius to dom element
        this.domElement.style.width = `${this.radius * 2}px`;
        this.domElement.style.height = `${this.radius * 2}px`;
    }

    draw() {
        this.domElement.style.left = `${this.position.x}px`;
        this.domElement.style.top = `${this.position.y}px`;

        return this;
    }

    remove() {
        this.domElement.remove();

        return this;
    }
}