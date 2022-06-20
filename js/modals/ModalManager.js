class ModalManager {
    previousModal;
    currentModal;
    
    stopWatch
    pauseButton

    menuModal;
    leaderboardModal;
    helpModal;
    settingsModal;
    pauseModal;
    resultModal;

    constructor() {
        this.previousModal = null;        
        this.currentModal = null;        

        this.stopWatch = document.querySelector("main .stopwatch");
        this.pauseButton = document.querySelector("main .pause-button");

        this.menuModal = new Modal("menu");
        this.leaderboardModal = new Modal("leaderboard");
        this.helpModal = new Modal("help");
        this.settingsModal = new Modal("settings");
        this.pauseModal = new Modal("pause");
        this.resultModal = new Modal("result");
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


    showLeaderboard(mode) {
        // change appearance of leaderbaord modal depending on mode
        let backButton = this.leaderboardModal.domElement.querySelector(".header button");
        let finishButtons = this.leaderboardModal.domElement.querySelector(".buttons");

        switch (mode) {
            case "back":
                backButton.style.display = "block";
                finishButtons.style.display = "none";
                break;
            
            case "finish":
                backButton.style.display = "none";
                finishButtons.style.display = "block";
                break;

            default:
                throw `ModalManager.showLeaderboard(mode): mode ${mode} does not exists!`;
        }
        if (mode != null) {

        }

        this.showModal(this.leaderboardModal);
    }

    showHelp() {
        this.showModal(this.helpModal);
    }

    updateLeaderboard(leaderboard) {
        // built table rows from data
        let rows = [];
        
        for (let i = 0; i < leaderboard.length; i++) {
            let rank = i + 1;
            let name = leaderboard[i].name;
            let time = leaderboard[i].time;
            
            let rankCell = document.createElement("td");
            rankCell.appendChild(document.createTextNode(`${rank}.`));
            let nameCell = document.createElement("td");
            nameCell.appendChild(document.createTextNode(name));
            let timeCell = document.createElement("td");
            timeCell.appendChild(document.createTextNode(`${time.toFixed(2)}`));
            
            let row = document.createElement("tr");
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(timeCell);

            rows.push(row);
        }

        // get leaderboard table
        let table = this.leaderboardModal.domElement.querySelector("table");
        table.textContent = "";

        // append highscore rows at leaderboard
        rows?.forEach(row => table.appendChild(row));
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