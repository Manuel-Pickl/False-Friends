class Modal {
    className;
    domElement;

    constructor(className) {
        this.className = className;
        this.domElement = document.querySelector(`.modal .${className}`);
    }
}