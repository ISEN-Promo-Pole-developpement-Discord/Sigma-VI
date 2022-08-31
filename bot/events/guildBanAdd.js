const {logCreate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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
         getActionAuthor(ban.guild, ban, "ban").then(userAuthor => {
         logCreate(
            ban.guild,
            "Ban",
            userAuthor,
            ban.user,
            "admin"
            );
    })
}}