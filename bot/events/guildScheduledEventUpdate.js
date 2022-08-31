const {logUpdate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

module.exports = {
    name: "guildScheduledEventUpdate",
    once: false,
    execute(oldGuildScheduledEvent, newGuildScheduledEvent) {
        /**
         * Emitted whenever a guild scheduled event gets updated.
         * @param {GuildScheduledEvent} oldGuildScheduledEvent The guild scheduled event object before the update
         * @param {GuildScheduledEvent} newGuildScheduledEvent The guild scheduled event object after the update
         * @event guildScheduledEventUpdate
         * @returns {Promise<void>}
         */
         getActionAuthor(oldGuildScheduledEvent.guild, oldGuildScheduledEvent, "guildScheduled Event").then(userAuthor => {
         logUpdate(
            oldGuildScheduledEvent.guild,
            "GuildScheduled",
            userAuthor,
            null,
            oldGuildScheduledEvent,
            newGuildScheduledEvent,
            "admin",
        );
    })}
}

    