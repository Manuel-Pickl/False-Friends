class SettingsModal extends Modal {
    constructor() {
        super("settings");
    }

    getContent() {
        return `
            <div class="header">
                <button onclick="back()">
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                </button>
                Settings
            </div>
            
            <div>
                <input type="checkbox" id="music" name="music" value="Music">
                <label for="music">
                    Music
                </label>
            </div>

            <div>
                <input type="checkbox" id="remote" name="remote" value="Remote">
                <label for="remote">
                    Remote Control
                </label>
            </div>

            <div class="value">
                <input id="name" type="text" maxlength="20">
                <button onclick="alert("connect")">
                    <i class="fa fa-flask" aria-hidden="true"></i>
                </button>
            </div>
        `;
    }
}