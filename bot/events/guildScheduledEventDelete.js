module.exports = {
    name: "guildScheduledEventDelete",
    once: false,
    execute(guildScheduledEvent) {
        /**
         * Emitted whenever a guild scheduled event is deleted.
         * @param {GuildScheduledEvent} guildScheduledEvent The guild scheduled event that got deleted
         * @event guildScheduledEventDelete
         * @returns {Promise<void>}
         */
    }
}