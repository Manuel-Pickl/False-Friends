class Crater extends Particle {
    depht;

    constructor(startPosition) {
        super(startPosition, 50);
        
        this.domElement.classList.add("crater");
        this.depth = 25; // in degrees
    }
}