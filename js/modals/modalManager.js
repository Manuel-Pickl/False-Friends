class ModalManager {
    previousModal;
    currentModal;

    pauseModal;
    resultModal;
    highscoresModal;
    settingsModal;

    constructor() {
        this.previousModal = null;        
        this.currentModal = null;        

        this.modal = document.querySelector(".modal");
        this.modalContent = document.querySelector(".modal .content");

        this.pauseModal = new PauseModal();
        this.resultModal = new ResultModal();
        this.highscoresModal = new HighscoresModal();
        this.settingsModal = new SettingsModal();
    }
    

    showPause() {
        this.changeModal(this.pauseModal);
        this.showModal();
    }

    showResults(time, rank) {
        this.changeModal(this.resultModal);
        
        // write time in form
        this.modalContent.querySelector(".time .value span").textContent = time;

        // write rank in form
        this.modalContent.querySelector(".rank .value").textContent = rank;
        
        // empty name input field
        this.modalContent.querySelector(".name input").value = "";
        
        this.showModal();
    }

    showHighscores(rows) {
        this.changeModal(this.highscoresModal);

        // append highscore rows on table
        rows.forEach(row => this.modalContent.querySelector("table").appendChild(row));

        this.showModal();
    }

    showSettings() {
        this.changeModal(this.settingsModal);
        this.showModal();
    }

    changeModal(modal) {
        this.previousModal = this.currentModal;
        this.currentModal = modal;
        this.modalContent.innerHTML = modal.getContent();
        this.modalContent.classList = `content ${modal.className}`;
    }

    showModal() {
        this.modal.style.visibility = "visible";
    }

    hideModal() {
        this.currentModal = null;
        this.modalContent.textContent = "";
        this.modalContent.classList = "content";

        this.modal.style.visibility = "hidden";
    }

    back() {
        this.changeModal(this.previousModal);
        this.showModal();
    }
}