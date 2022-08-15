const {logDelete} = require('../modtools/log/logModules.js');
const {deleteChannel} = require('../utils/config-forms.js');
const db = require("../bdd/utilsDB");

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
        let UserName=null;
        member.guild.channels.fetch()
        .then( channels => channels.forEach((entry,snowflake) => {
                if(entry.name){                  
                    entry.name.split(`-`).forEach((entry,snowflake) => {
                        if(!(typeof entry===Number)){
                            if(!(entry===`welcome`)){
                                UserName+=entry;
                            }
                        }
                    })
                    if(entry.name.split(`-`)[0]=='welcome' && entry.name.split(`-`)[1]==UserName.toLowerCase()){
                        deleteChannel(member.guild,entry)
                    }
                }

        }));

        db.connection.query(`UPDATE user_guild_status
            SET status = 4,
             form_id = null
             WHERE user_id = '${member.id}' && guild_id = '${member.guild.id}'`);

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
