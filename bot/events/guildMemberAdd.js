const {logCreate} = require('../modtools/log/log-admin.js');
const {createChannel} = require('../utils/config-forms.js');


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
         createChannel(member.guild,member.user);
            /* member.createDM().then(channel => {
            
         });*/


            logCreate(
               member.guild,
               "GuildMember",
               null,
               member,
               "io"
               );
        }
}