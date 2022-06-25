/**
 * Manages the visibility of all Modals
 */
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

    /**
     * Create and initialize an instance of ModalManager
     */
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
    
    /**
     * Show the start menu Modal
     * @returns {ModalManager} Returns itself for method chaining
     */
    showStartMenu() {
        this.showModal(this.menuModal);
        
        this.stopWatch.style.visibility = "hidden";
        this.pauseButton.style.visibility = "hidden";

        return this;
    }

    /**
     * Hide the start menu Modal
     * @returns {ModalManager} Returns itself for method chaining
     */
    hideStartMenu() {
        this.hideModal(this.menuModal);

        this.stopWatch.style.visibility = "visible";
        this.pauseButton.style.visibility = "visible";

        return this;
    }

    /**
     * Show the pause Modal
     */
    showPause() {
        this.showModal(this.pauseModal);
    }

    /**
     * Show the result Modal with filled in values
     * @param {number} time The completion time in milli seconds
     * @param {number} rank The achieved rank
     */
    showResults(time, rank) {
        this.showModal(this.resultModal);
        
        // write time in form
        this.resultModal.domElement.querySelector(".time .value span").textContent = time;

        // write rank in form
        this.resultModal.domElement.querySelector(".rank .value").textContent = rank;
        
        // empty name input field
        this.resultModal.domElement.querySelector(".name input").value = "";
    }

    /**
     * Show the leaderboard Modal.
     * @param {string} mode The appearance mode of the Modal. Possible values are "back" for a back button and "finish" for a home menu and restart button 
     */
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

    /**
     * Show the help Modal
     */
    showHelp() {
        this.showModal(this.helpModal);
    }

    /**
     * Update the leaderboard table in the leaderboard Modal
     * @param {object[]} leaderboard Leaderboard Array consisting of {name, time} objects sorted ascending by time
     */
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

    /**
     * Show the settings Modal
     */
    showSettings() {
        this.showModal(this.settingsModal);
    }

    /**
     * Show the given Modal
     * @param {Modal} modal Modal thats going to be shown
     */
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

    /**
     * Hide the given Modal
     * @param {Modal} modal Modal thats going to be hidden
     */
    hideModal(modal = null) {
        modal ??= this.currentModal;

        this.currentModal = null;
        modal.domElement.style.visibility = "hidden";
    }

    /**
     * Show the previous Modal and hide the current one
     */
    back() {
        if (this.previousModal == null) {
            this.hideModal();
        }
        else {
            this.showModal(this.previousModal);
        }
    }
}