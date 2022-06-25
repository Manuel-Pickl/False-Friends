/**
 * Mud obstacle which slows the ball down
 * @extends Obstacle
 */
 class Mud extends Obstacle {
    /**
     * Create a Mud puddle at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Bump
     * @param {number} radius Radius of the Bump
     */
    constructor(startPosition, radius) {
        super(startPosition, radius);
        
        this.domElement.classList.add("mud");
    }
}