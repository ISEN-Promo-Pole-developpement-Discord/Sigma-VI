const {logCreate, logDelete} = require('../modtools/log/logModules.js');

module.exports = {
    name: "guildBanRemove",
    once: false,
    execute(ban) {
        /**
         * Triggered when an user gets removed from the banlist of a server
         * @param {GuildBan} ban The ban that got removed
         * @event guildBanRemove
         * @returns {Promise<void>}
         */
        logDelete(
            ban.guild,
            "ban",
            null,
            null,
            ban.user,
            "admin"

        )
    }
}