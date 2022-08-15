const {logCreate, logDelete} = require('../modtools/log/logModules.js');

module.exports = {
    name: "guildBanAdd",
    once: false,
    execute(ban) {
        /**
         * Triggered when an user gets added in the banlist of a server
         * @param {GuildBan} ban The ban that got added
         * @event guildBanAdd
         * @returns {Promise<void>}
         */
         logCreate(
            ban.guild,
            "ban",
            null,
            ban.user,
            "admin"
            );
    }
}