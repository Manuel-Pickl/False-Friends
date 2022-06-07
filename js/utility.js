class Utility {
    /*
    source: https://www.w3schools.com/js/js_random.asp
    */
    static getRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}