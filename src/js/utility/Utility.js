/**
 * Utility class for common methods and values
 */
class Utility {
    /**
     * Get a random integer in a given range
     * @param {number} min Mininum value in range
     * @param {number} max Maximum value in range
     * @returns {number} Random Integer in given range
     */
    static getRandomIntegerInRange(min, max) {
        /*
        source: https://www.w3schools.com/js/js_random.asp
        */
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    static headerHeight = 60;

    static canvas = document.querySelector(".canvas");
}