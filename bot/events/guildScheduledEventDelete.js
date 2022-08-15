const { logDelete } = require("../modtools/log/log-admin");
const {getActionAuthor} = require('../modtools/log/logger.js');

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

         getActionAuthor(guildScheduledEvent.guild, guildScheduledEvent, "guildScheduled Event").then(userAuthor => {
            logDelete(
               guildScheduledEvent.guild,
               "GuildScheduled Event",
               userAuthor,
               null,
               guildScheduledEvent,
               "admin",
           );
       })
   }
}
