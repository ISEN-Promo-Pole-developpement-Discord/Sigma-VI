const {logDelete} = require('../modtools/log/logModules.js');
const {deleteChannel} = require('../utils/config-forms.js');
const {UserGuildStatusManager} = require("../bdd/classes/userGuildStatusManager");
const {FormsManager} = require("../bdd/classes/formsManager");

module.exports = {
    name: "guildMemberRemove",
    once: false,
    async execute(member) {
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
                    if(entry.name.split(`-`)[0]==='welcome' && entry.name.split(`-`)[1] === UserName.toLowerCase()){
                        deleteChannel(member.guild, entry)
                    }
                }

        }));

        const userStatus = await UserGuildStatusManager.getUserGuildStatus({id: member.id, guild_id: member.guild.id});
        if (userStatus !== null)
            await userStatus.setStatus(4);

        const userForm = await FormsManager.getForm(member.id, member.guild.id);
        if (userForm !== null)
            await FormsManager.deleteForm(userForm.form_id);

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
