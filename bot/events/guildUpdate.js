const {logUpdate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "guildUpdate",
    once: false,
    execute(oldGuild, newGuild) {
        /**
         * Emitted whenever a guild is updated - e.g. name change.
         * @param {Guild} oldGuild The guild before the update
         * @param {Guild} newGuild The guild after the update
         * @event guildUpdate
         * @returns {Promise<void>}
         */
         logUpdate(
            oldGuild,   
            "GuildUpdate",
            null,
            null,
            oldGuild,
            newGuild,
            "admin",
        );  
    }
}