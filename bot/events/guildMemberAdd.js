const {logCreate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    execute(member) {
        /**
         * Emitted whenever a user joins a guild
         * @param {GuildMember} member The member that joined
         * @event guildMemberAdd
         * @returns {Promise<void>}
         */

        console.log(member);
        console.log(`guild: ${member.guild}`);
         
            logCreate(
               member.guild,
               "member",
               null,
               member,
               "admin"
               );
        }
}