class ModalManager {
    previousModal;
    currentModal;

    modal
    currentModal

    stopWatch
    pauseButton

    leaderboardModal;
    menuModal;
    pauseModal;
    resultModal;
    settingsModal;

    constructor() {
        this.previousModal = null;        
        this.currentModal = null;        

        this.modal = document.querySelector(".modal");
        this.modalContent = document.querySelector(".modal .modal-content");
        
        this.stopWatch = document.querySelector("main .stopwatch");
        this.pauseButton = document.querySelector("main .pause-button");

        this.leaderboardModal = new LeaderboardModal();
        this.menuModal = new MenuModal();
        this.pauseModal = new PauseModal();
        this.resultModal = new ResultModal();
        this.settingsModal = new SettingsModal();
    }
    

    showStartMenu() {
        this.changeModal(this.menuModal);
        
        this.stopWatch.style.visibility = "hidden";
        this.pauseButton.style.visibility = "hidden";

        this.showModal();

        return this;
    }

    hideStartMenu() {
        this.hideModal();

        this.stopWatch.style.visibility = "visible";
        this.pauseButton.style.visibility = "visible";

        return this;
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


    showLeaderboard(rows = null) {
        this.changeModal(this.leaderboardModal);

        // append highscore rows on table
        rows?.forEach(row => this.modalContent.querySelector("table").appendChild(row));

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
        this.modalContent.classList = `modal-content ${modal.className}`;
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
        if (this.previousModal == null) {
            this.hideModal();
        }
        else {
            this.changeModal(this.previousModal);
            this.showModal();
        }
    }
}