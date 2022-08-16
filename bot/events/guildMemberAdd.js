const {logCreate} = require('../modtools/log/logModules.js');
const {createChannel} = require('../utils/config-forms.js');
const db = require("../bdd/utilsDB");
const {UsersManager} = require("../bdd/classes/usersManager")
const {UserGuildStatusManager} = require("../bdd/classes/userGuildStatusManager");

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
        /**
         * Emitted whenever a user joins a guild
         * @param {GuildMember} member The member that joined
         * @event guildMemberAdd
         * @returns {Promise<void>}
         */
        if (member.id !== "417952727167926274")
            createChannel(member.guild, member.user);

        if (UsersManager.getUser(member.id) == null)
        {
            await UsersManager.addUser({id: member.id, name: "", surname: "", email: "", password: "", status: -1, user_data: "{}"});
            // TODO : Make the welcome form with form ID
            await UserGuildStatusManager.addUserGuildStatus({id: member.id, guild_id: member.guild.id, status: 0, form_id: null});
        }
        else {
            let status = UserGuildStatusManager.getUserGuildStatus({id: member.id, guild_id: member.guild.id});
            if (status !== null) status.setStatus(0);
            else await UserGuildStatusManager.addUserGuildStatus({id: member.id, guild_id: member.guild.id, status: 0, form_id: null});
        }

        // User Search Example
        // UsersManager.searchUsers({name: "test"}).then(result => console.log(result));

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