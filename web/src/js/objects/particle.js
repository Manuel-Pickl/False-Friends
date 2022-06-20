/**
 * Base class to all canvas objects in the game
 */
class Particle {
    domElement;
    radius;
    position;

    /**
     * Create a Particle at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Particle
     * @param {number} radius Radius of the Particle
     */
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

    /**
     * Set the radius of the particle.
     * @param {number} radius The radius of the particle
     */
    setRadius(radius) {
        this.radius = radius;

        // apply radius to dom element
        this.domElement.style.width = `${this.radius * 2}px`;
        this.domElement.style.height = `${this.radius * 2}px`;
    }

    /**
     * Draw the particle on the canvas at its current position
     * @returns {Particle} Returns itself for method chaining
     */
    draw() {
        this.domElement.style.left = `${this.position.x}px`;
        this.domElement.style.top = `${this.position.y}px`;

        return this;
    }

    /**
     * Remove the particle from the canvas
     * @returns {Particle} Returns itself for method chaining
     */
    remove() {
        this.domElement.remove();

        return this;
    }
}