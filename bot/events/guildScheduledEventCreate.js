const {logCreate} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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
         getActionAuthor(guildScheduledEvent.guild, guildScheduledEvent, "guildScheduled Event").then(userAuthor => {
         logCreate(
            guildScheduledEvent.guild,
            "GuildScheduled Event",
            userAuthor,
            guildScheduledEvent,
            "admin",
        );
    })}
}