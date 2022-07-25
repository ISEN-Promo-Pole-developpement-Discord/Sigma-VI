const {logDelete} = require('../modtools/log/log-admin.js');
const {deleteChannel} = require('../utils/config-forms.js');
module.exports = {
    name: "guildMemberRemove",
    once: false,
    execute(member) {
        /**
         * Emitted whenever a member leaves a guild, or is kicked.
         * @param {GuildMember} member The member that left, or was kicked
         * @event guildMemberRemove
         * @returns {Promise<void>}
         */
        member.guild.channels.fetch()
        .then( channels => channels.forEach((entry,snowflake) => {
                if(entry.name){
                    console.log(`entry.name : ${entry.name}`);
                    console.log(`\nsplit : ${entry.name.split(`-`)} et le user est : ${member.username}`)
                    if(entry.name.split(`-`)[0]=='welcome' && entry.name.split(`-`)[1]==member.user.username.toLowerCase()){
                        deleteChannel(member.guild,entry)
                    }
                }

        }
        )
        )
        logDelete(
            member.guild,
            "GuildMember",
            null,
            null,
            member,
            "io"
        );
    }
}
