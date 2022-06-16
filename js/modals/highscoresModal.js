class LeaderboardModal extends Modal {
    constructor() {
        super("leaderboard");
    }

    getContent() {
        return `
            <div class="header">Leaderboard</div>
            <table></table>
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