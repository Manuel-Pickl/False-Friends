class Hole extends Particle {
    constructor(startPosition, radius) {
        super(startPosition, radius);
        
        this.domElement.classList.add("hole");
    }

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