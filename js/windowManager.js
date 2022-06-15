class WindowManager {
    currentWindow
    endScreen
    results
    highscores

    constructor() {
        this.currentWindow = null;
        this.endScreen = document.querySelector(".end-screen");
        this.results = document.querySelector(".results");
        this.highscores = document.querySelector(".highscores");
    }
    
    showResults(time, rank) {
        this.currentWindow = "results";

        // write time in form
        document.querySelector(".end-screen .time .value span").innerHTML = time;
        
        // write rank in form
        document.querySelector(".end-screen .rank .value").innerHTML = rank;
      
        this.endScreen.style.visibility = "visible";
        this.results.style.visibility = "visible";
    }
    
    hideResults() {
        this.currentWindow = null;
        this.endScreen.style.visibility = "hidden";
        this.results.style.visibility = "hidden";
    }

    showHighscores() {
        this.currentWindow = "highscores";
        this.endScreen.style.visibility = "visible";
        this.highscores.style.visibility = "visible";
    }

    hideHighscores() {
        this.currentWindow = null;
        this.endScreen.style.visibility = "hidden";
        this.highscores.style.visibility = "hidden";
    }
}