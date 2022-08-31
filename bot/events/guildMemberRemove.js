const {logDelete} = require('../modtools/log/logModules.js');
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

        const userStatus = await UserGuildStatusManager.getUserGuildStatus({id: member.id, guild_id: member.guild.id});
        if (userStatus !== null)
            await userStatus.setStatus(4);

        const userForms = await FormsManager.searchForms(member.id, member.guild.id);
        if (userForms !== null){
            for(var userForm of userForms){
                await userForm.delete();
            }
        }
        // if (userForm !== null)
        //     await FormsManager.deleteForm(userForm.form_id);

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
