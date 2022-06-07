class Crater extends Hole {
    slope;
    // x^6 * e^-17   <=>   \_/   -> P(-25|10) P(25|10)


    constructor(startPosition, radius) {
        super(startPosition, radius);
        
        this.domElement.classList.add("crater");
        this.slope = 60; // in degrees
    }

    getAngleAtPoint(point) {
        let angleX = point.x > this.position.x ? -this.slope : this.slope;
        let angleY = point.y > this.position.y ? -this.slope : this.slope;
        let angle = new Point(angleX, angleY);

        return angle;
    }
}