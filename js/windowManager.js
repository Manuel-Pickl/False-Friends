class WindowManager {
    currentWindow
    endScreen
    results
    highscores

    constructor() {
        this.currentWindow = null;
        this.pause = document.querySelector("#pause-menu");
        this.endScreen = document.querySelector("#end-screen");
        this.results = document.querySelector(".results");
        this.highscores = document.querySelector(".highscores");
    }
    

    showPause() {
        this.currentWindow = "pause";
        this.pause.style.visibility = "visible";
    }

    hidePause() {
        this.currentWindow = null;
        this.pause.style.visibility = "hidden";
    }


    showResults(time, rank) {
        this.currentWindow = "results";

        // write time in form
        this.results.querySelector(".time .value span").textContent = time;
        // write rank in form
        this.results.querySelector(".rank .value").textContent = rank;

        // empty name input field
        this.results.querySelector(".name input").value = "";
      
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