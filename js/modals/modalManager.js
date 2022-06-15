class ModalManager {
    currentWindow;
    pauseModal;
    resultModal;
    highscoresModal;

    constructor() {
        this.currentWindow = null;        

        this.modal = document.querySelector(".modal");
        this.modalContent = document.querySelector(".modal .content");

        this.pauseModal = new PauseModal();
        this.resultModal = new ResultModal();
        this.highscoresModal = new HighscoresModal();
    }
    

    showPause() {
        this.currentWindow = "pause";
        this.modalContent.innerHTML = this.pauseModal.getContent();
        this.modalContent.classList = `content ${this.pauseModal.className}`;

        this.modal.style.visibility = "visible";
    }

    showResults(time, rank) {
        this.currentWindow = "results";
        this.modalContent.innerHTML = this.resultModal.getContent();
        this.modalContent.classList = `content ${this.resultModal.className}`;

        // write time in form
        this.modalContent.querySelector(".time .value span").textContent = time;

        // write rank in form
        this.modalContent.querySelector(".rank .value").textContent = rank;
        
        // empty name input field
        this.modalContent.querySelector(".name input").value = "";
        
        this.modal.style.visibility = "visible";
    }

    showHighscores(rows) {
        this.currentWindow = "highscores";
        this.modalContent.innerHTML = this.highscoresModal.getContent();
        this.modalContent.classList = `content ${this.highscoresModal.className}`;

        // append highscore rows on table
        rows.forEach(row => this.modalContent.querySelector("table").appendChild(row));

        this.modal.style.visibility = "visible";
    }

    hideModal() {
        this.currentWindow = null;
        this.modalContent.textContent = "";
        this.modalContent.classList = "content";

        this.modal.style.visibility = "hidden";
    }
}