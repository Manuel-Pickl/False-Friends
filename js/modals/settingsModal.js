class SettingsModal extends Modal {
    constructor() {
        super("settings");
    }

    getContent() {
        return `
            <div class="header">
                Settings
            </div>
            
            <input type="checkbox" id="music" name="music" value="Music">
            <label for="music">
                Music
            </label>

            <div class="name">
                <div class="description">
                    Enter the raspberry ip:
                </div>
                <div class="value">
                    <input id="name" type="text" maxlength="20">
                    <button onclick="alert("connect")">
                        <i class="fa fa-flask" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            <div class="buttons">
                <button onclick="back()">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
            </div>
        `;
    }
}