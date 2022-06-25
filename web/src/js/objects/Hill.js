/**
 * Hill obstacle which pushed the ball outside
 * @extends Bump
 */
 class Hill extends Bump {
    /**
     * Create a Hill at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Hill
     * @param {number} radius Radius of the Hill
     * @param {number} slope Slope of the Hill
     */
    constructor(startPosition, radius, slope) {
        super(startPosition, radius, slope);
        
        this.domElement.classList.add("hill");
    }
}