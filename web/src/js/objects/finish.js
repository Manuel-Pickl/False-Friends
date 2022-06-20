class Finish extends Hole {
    constructor(startPosition, radius) {
        super(startPosition, radius);
        
        this.domElement.classList.add("finish");
    }

    isCircleInside(point, radius, percent = 0) {
        let distance = Math.sqrt(Math.pow(this.position.x - point.x, 2) + Math.pow(this.position.y - point.y, 2));
        let isCircleInside = distance + radius * percent < this.radius;

        return isCircleInside;
    }
}