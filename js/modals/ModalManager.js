class ModalManager {
    previousModal;
    currentModal;
    
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

        this.stopWatch = document.querySelector("main .stopwatch");
        this.pauseButton = document.querySelector("main .pause-button");

        this.leaderboardModal = new Modal("leaderboard");
        this.menuModal = new Modal("menu");
        this.pauseModal = new Modal("pause");
        this.resultModal = new Modal("result");
        this.settingsModal = new Modal("settings");
    }
    

    showStartMenu() {
        this.showModal(this.menuModal);
        
        this.stopWatch.style.visibility = "hidden";
        this.pauseButton.style.visibility = "hidden";

        return this;
    }

    hideStartMenu() {
        this.hideModal(this.menuModal);

        this.stopWatch.style.visibility = "visible";
        this.pauseButton.style.visibility = "visible";

        return this;
    }


    showPause() {
        this.showModal(this.pauseModal);
    }


    showResults(time, rank) {
        this.showModal(this.resultModal);
        
        // write time in form
        this.resultModal.domElement.querySelector(".time .value span").textContent = time;

        // write rank in form
        this.resultModal.domElement.querySelector(".rank .value").textContent = rank;
        
        // empty name input field
        this.resultModal.domElement.querySelector(".name input").value = "";
    }


    showLeaderboard() {
        this.showModal(this.leaderboardModal);
    }


    showSettings() {
        this.showModal(this.settingsModal);
    }


    showModal(modal) {
        // save current modal for back functionality & hide it
        if (this.currentModal != null) {
            this.previousModal = this.currentModal;
            this.hideModal(this.currentModal);
        }
        
        // set new modal
        this.currentModal = modal;
        modal.domElement.style.visibility = "visible";
    }

    hideModal(modal = null) {
        modal ??= this.currentModal;

        this.currentModal = null;
        modal.domElement.style.visibility = "hidden";
    }

    back() {
        if (this.previousModal == null) {
            this.hideModal();
        }
        else {
            this.showModal(this.previousModal);
        }
    }
}