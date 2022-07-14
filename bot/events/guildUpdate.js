const {logUpdate} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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

         getActionAuthor(oldGuild.guild, oldGuild, "invite").then(userAuthor => {
         logUpdate(
            oldGuild,   
            "GuildUpdate",
            {
                username: userAuthor.tag,
                avatarURL: userAuthor.displayAvatarURL(),
            },
            null,
            oldGuild,
            newGuild,
            "admin",
        );  
    }
    )}
}