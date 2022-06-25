/**
 * Underlying class for all Modals in the game
 */
class Modal {
    className;
    domElement;

    /**
     * Create a Modal of the given class.
     * @param {string} className Name of the Modal
     */
    constructor(className) {
        this.className = className;
        this.domElement = document.querySelector(`.modal .${className}`);
    }
}