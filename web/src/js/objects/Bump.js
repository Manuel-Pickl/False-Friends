/**
 * Bump obstacle which changes the board angles
 * @extends Obstacle
 */
 class Bump extends Obstacle {
    slope;

    /**
     * Create a Bump at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Bump
     * @param {number} radius Radius of the Bump
     * @param {number} slope Slope of the Bump
     */
    constructor(startPosition, radius, slope) {
        super(startPosition, radius);
        
        this.domElement.classList.add("bump");
        this.slope = slope; // in degrees
    }

    /**
     * Get the slope of the Bump at an specific point
     * @param {Point} point Point of the checked angle
     * @returns {Point} X and Y angles as Point variable
     */
     getAngleAtPoint(point) {
        let angleX = point.x > this.position.x ? -this.slope : this.slope;
        let angleY = point.y > this.position.y ? -this.slope : this.slope;
        let angle = new Point(angleX, angleY);

        return angle;
    }
}