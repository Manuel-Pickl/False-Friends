class HighscoresModal extends Modal {
    constructor() {
        super("highscores");
    }

    getContent() {
        return `
            <div class="header">Highscores</div>
            <table id="highscores"></table>
            <div class="buttons">
                <button>
                    <i class="fa fa-home" aria-hidden="true"></i>
                </button>
                <button onclick="restartGame()">
                    <i class="fa fa-repeat" aria-hidden="true"></i>
                </button>
            </div>
        `;
    }
}