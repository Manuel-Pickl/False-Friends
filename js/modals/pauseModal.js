class PauseModal extends Modal {
    constructor() {
        super("pause");
    }

    getContent() {
        return `
            <div class="header">
                Paused
            </div>
            
            <button onclick="resumeGame()">
                Resume
            </button>

            <button onclick="restartGame()">
                Restart
            </button>
            
            <button>
                Quit
            </button>
            
            <button onclick="showSettings()">
                Settings
            </button>
        `;
    }
}