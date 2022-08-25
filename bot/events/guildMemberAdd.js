const {logCreate} = require('../modtools/log/logModules.js');
const {createChannel} = require('../utils/config-forms.js');
const db = require("../bdd/utilsDB");
const {UsersManager} = require("../bdd/classes/usersManager")
const {UserGuildStatusManager} = require("../bdd/classes/userGuildStatusManager");
const {FormsManager} = require("../bdd/classes/formsManager");

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

        console.log(`>> [+] ${member.user.tag} a rejoint ${member.guild.name}`);

        logCreate(
            member.guild,
            "GuildMember",
            null,
            member,
            "io"
        );

        if(!member.user.bot)
        {
            // const userForms = await FormsManager.searchForms(member.id, member.guild.id);
            // if (userForms !== null) {
            //     for (const form_id of userForms) await FormsManager.deleteForm(form_id);
            // }
            // TODO: Need to make this function returns the channel obj to get its id (or fetch it)
            const channel = createChannel(member.guild, member.user);

            let USER = await UsersManager.getUser(member.id);
            if(USER === null)
            {
                if(global.debug) console.log("> User not found, creating new user");
                // User
                USER = await UsersManager.addUser({id: member.id, name: "", surname: "", email: "", password: "", status: -1, data: "{}"});
                if(global.debug) console.log("> User created");
                // Form
                // const form = await FormsManager.addForm({user_id: member.id, guild_id: member.guild.id, channel_id: channel.id, status: 0});
                // await form.generateVerificationCode();
                // User Guild Status
                await UserGuildStatusManager.addUserGuildStatus({id: member.id, guild_id: member.guild.id, status: 0, form_id: null});
                if(global.debug) console.log("> UserGuildStatus created");
            } else {
                if(global.debug) console.log("> User found");
                await UserGuildStatusManager.addUserGuildStatus({id: member.id, guild_id: member.guild.id, status: 0, form_id: null});
                if(global.debug) console.log("> UserGuildStatus updated");
            }
        }
    }
}