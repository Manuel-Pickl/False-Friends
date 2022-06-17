class LeaderboardManager {
    leaderboard;

    serialize() {
        // write values to localStorage
        localStorage.setItem("leaderboard", JSON.stringify(this.leaderboard));
    }

    deserialize() {
        // read values from localStorage
        this.leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
        if (!this.leaderboard) {
            this.leaderboard = [];
        }
    }

    update(name, time) {
        let rank = this.calculateRank(time);
        this.leaderboard.splice(rank - 1, 0, {name, time});

        this.serialize();
    }

    clear() {
        localStorage.clear();
    }

    calculateRank(time) {
        // calculate rank
        let rank = 1;
        let rankDetermined = false;
        while (!rankDetermined && rank <= this.leaderboard.length) {
            // if current time is better than highscore on rank x
            if (time < this.leaderboard[rank - 1].time) {
                rankDetermined = true;
            }
            else {
                rank++;
            }
        }

        return rank;
    }
}