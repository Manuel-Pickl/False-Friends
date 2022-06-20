/**
 * Finish object, in which the ball needs to be navigated
 * @extends Hole
 */
class Finish extends Hole {
    /**
     * Create a Finish at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Finish
     * @param {number} radius Radius of the Finish
     */
    constructor(startPosition, radius) {
        super(startPosition, radius);
        
        this.domElement.classList.add("finish");
    }

    /**
     * Checks if a given percentage of another cirlce is inside the finish hole
     * @param {Point} point Middle point of the other circle
     * @param {number} radius Radius of the other circle
     * @param {float} percent Value between 0 and 1, which indicates how much percentage of the circle has to be inside the finish hole
     * @returns {boolean} true or false, if the circle is inside the finish hole
     */
    isCircleInside(point, radius, percent = 0) {
        let distance = Math.sqrt(Math.pow(this.position.x - point.x, 2) + Math.pow(this.position.y - point.y, 2));
        let isCircleInside = distance + radius * percent < this.radius;

        return isCircleInside;
    }
}