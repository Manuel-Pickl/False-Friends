/**
 * Incredible useful utility class for storing values belonging together
 */
class Point {
    x;
    y;

    /**
     * Create a Point with the given values for x and y
     * @param {number} x X point
     * @param {number} y Y point
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}