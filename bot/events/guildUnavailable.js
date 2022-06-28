module.exports = {
    name: "guildUnavailable",
    once: false,
    execute(guild) {
        /**
         * Emitted whenever a guild becomes unavailable, likely due to a server outage.
         * @param {Guild} guild The guild that became unavailable
         * @event guildUnavailable
         * @returns {Promise<void>}
         */
    }
}