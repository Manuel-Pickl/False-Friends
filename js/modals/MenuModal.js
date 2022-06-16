class MenuModal extends Modal {
    constructor() {
        super("menu");
    }

    getContent() {
        return `
            <button onclick="startGame()">
                <span>
                play
                </span><br>
                <span>
                    false friends
                </span>
            </button>
            
            <div class="buttons">
                <button onclick="showLeaderboard()">
                    <i class="fa fa-trophy" aria-hidden="true"></i>
                </button>

                <button onclick="showHelp()">
                    <i class="fa fa-question" aria-hidden="true"></i>
                </button>

                <button onclick="showSettings()">
                    <i class="fa fa-cog" aria-hidden="true"></i>
                </button>
            </div>
        `;
    }   
}