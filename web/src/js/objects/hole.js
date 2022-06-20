/**
 * Hole as parent class for canvas objects other than Ball
 * @extends Particle
 */
class Hole extends Particle {
    /**
     * Create a Hole at the given start position with the given radius and bind an ui element to it.
     * @param {Point} startPosition Start position of the Hole
     * @param {number} radius Radius of the Hole
     */
    constructor(startPosition, radius) {
        super(startPosition, radius);
        
        this.domElement.classList.add("hole");
    }

    /**
     * Check if a given points lies inside the hole
     * @param {Point} point The point which is going to be checked
     * @returns {boolean} true or false, depending if the point is inside the hole
     */
    isPointInside(point) {
        /*
            source: https://lakschool.com/de/mathe/kreise-kugeln/lage-kreis-punkt

            (x0​ − xM​)^2 + (y0​ − yM​)^2 > r^2 -> außerhalb des Kreises

            P(x0​∣y0​) zum Mittelpunkt M(xM∣yM)
        */
        let isPointInside = 
            (Math.pow(point.x - this.position.x, 2) 
            + Math.pow(point.y - this.position.y, 2)) 
            <= Math.pow(this.radius, 2);

        if (isPointInside) {
            // Physics.resistance = 0.01;
            // this.domElement.style.backgroundColor = "orange";
        }
        else {
            // Physics.resistance = 0.005;
            // this.domElement.style.backgroundColor = "grey";
        }

        return isPointInside;
    }
}