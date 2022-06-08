class Finish extends Hole {
    constructor(startPosition, radius) {
        super(startPosition, radius);
        
        this.domElement.classList.add("finish");
    }

    isCircleInside(point, radius) {
        let distance = Math.sqrt(Math.pow(this.position.x - point.x, 2) + Math.pow(this.position.y - point.y, 2));
        let isCircleInside = distance + radius < this.radius;

        return isCircleInside;
    }
}