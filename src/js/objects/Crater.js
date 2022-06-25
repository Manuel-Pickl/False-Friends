/**
 * Crater obstacle which sucks the ball inside
 * @extends Bump
 */
class Crater extends Bump {
    /**
     * Create a Crater at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Crater
     * @param {number} radius Radius of the Crater
     * @param {number} slope Slope of the Crater
     */
    constructor(startPosition, radius, slope) {
        super(startPosition, radius, slope);
        
        this.domElement.classList.add("crater");
    }
}