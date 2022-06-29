module.exports = {
    name: "guildScheduledEventCreate",
    once: false,
    execute(guildScheduledEvent) {
        /**
         * Emitted whenever a guild scheduled event is created.
         * @param {GuildScheduledEvent} guildScheduledEvent The guild scheduled event that got created
         * @event guildScheduledEventCreate
         * @returns {Promise<void>}
         */
    }
}