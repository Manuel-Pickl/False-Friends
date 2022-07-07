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

    /**
     * Get formatted time string.
     * @param {number} time Time in seconds
     * @returns {string} Time as formatted string in the format mm:ss
     */
     static formatTime(time) {
        // get correct format of minutes
        let minutes = Math.floor(time / 60);
        let minutesString = minutes > 0 ? `${minutes}:` : "";
        
        // get correct format of seconds
        let seconds = time % 60;
        let secondsString = minutes > 0 && seconds < 10 
        ? `0${seconds.toFixed(2)}` 
        : seconds.toFixed(2);

        return `${minutesString}${secondsString}`;
    }
}