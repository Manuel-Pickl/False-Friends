/**
 * Manage the de/serialization and updating of the leaderboard
 */
class LeaderboardManager {
    leaderboard;

    /**
     * Serialize the leaderboard
     */
    serialize() {
        // write values to localStorage
        localStorage.setItem("leaderboard", JSON.stringify(this.leaderboard));
    }

    /**
     * Deserialize the leaderboard
     */
    deserialize() {
        // read values from localStorage
        this.leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
        if (!this.leaderboard) {
            this.leaderboard = [];
        }
    }

    /**
     * Update the leaderboard with a new entry at the correct place ascending by time
     * @param {string} name Name of the player
     * @param {number} time Achieved time of the player in milli seconds
     */
    update(name, time) {
        let rank = this.calculateRank(time);
        this.leaderboard.splice(rank - 1, 0, {name, time});

        this.serialize();
    }

    /**
     * Clear the current leaderboard values
     */
    clear() {
        localStorage.clear();
        this.deserialize();
    }

    /**
     * Calculate the rank of the player by its achieved time
     * @param {number} time Achieved time of the player in milli seconds
     * @returns {number} Calculated rank
     */
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