class WindowManager {
    previousModal;
    currentModal;

    pauseModal;
    resultModal;
    leaderboardModal;
    settingsModal;

    constructor() {
        this.previousModal = null;        
        this.currentModal = null;        

        this.modal = document.querySelector(".modal");
        this.modalContent = document.querySelector(".modal .content");
        
        this.stopWatch = document.querySelector("main .stopwatch");
        this.pauseButton = document.querySelector("main .pause-button");
        this.header = document.querySelector("header");

        this.pauseModal = new PauseModal();
        this.resultModal = new ResultModal();
        this.leaderboardModal = new LeaderboardModal();
        this.settingsModal = new SettingsModal();
    }
    

    showStartMenu() {
        this.hideModal();

        this.stopWatch.style.visibility = "hidden";
        this.pauseButton.style.visibility = "hidden";
        this.header.style.display = "block";

        return this;
    }

    hideStartMenu() {
        this.stopWatch.style.visibility = "visible";
        this.pauseButton.style.visibility = "visible";
        this.header.style.display = "none";

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
        if (this.previousModal == null) {
            this.hideModal();
        }
        else {
            this.changeModal(this.previousModal);
            this.showModal();
        }
    }
}