/**
 * Crater obstacle which sucks the ball inside
 * @extends Hole
 */
class Crater extends Hole {
    slope;

    /**
     * Create a Crater at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Crater
     * @param {number} radius Radius of the Crater
     */
    constructor(startPosition, radius) {
        super(startPosition, radius);
        
        this.domElement.classList.add("crater");
        this.slope = 60; // in degrees
    }

    /**
     * Get the slope of the crater at an specific point
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