class ResultModal extends Modal {
    constructor() {
        super("result");
    }

    getContent() {
        return `
            <div class="header">Finished!</div>
            <div class="time">
            <div class="description">Your time was</div>
            <div class="value"><span>10.78</span><!-- seconds--></div>
            </div>
            <div class="rank">
            <div class="description">Rank:</div>
            <div class="value">3</div>
            </div>
            <div class="name">
            <div class="description">Enter your name:</div>
            <div class="value">
                <input id="name" type="text" maxlength="20">
                <button onclick="showResults()">
                <i class="fa fa-share" aria-hidden="true"></i>
                </button>
            </div>
        `;
    }
}