const {logCreate} = require('../modtools/log/log-admin.js');
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

         // TODO : Need to be change with getUser() ?
        db.connection.query(`SELECT * FROM user WHERE user_id = ${member.id}`, function(err, row)
        {
            if (err)
                throw(err);
            else {
                // If there is no data in db for this user

                if (!(row && row.length))
                {
                    UsersManager.addUser({id: member.id, name: "", surname: "", email: "", password: ""});
                    UserGuildStatusManager.addUserGuildStatus({user_id: member.id, guild_id: member.guild.id, status: 0, form_id: null});
                    // TODO : Need to implement the form_id
                }
                else {
                    // db.connection.query(`UPDATE user_guild_status SET status = 0 WHERE user_id = "${member.id}" && guild_id = "${member.guild.id}"`);
                } // TODO : Need to implement the change of form_id
            }
        });
        // Only here to test
        // console.log(UsersManager.getUser(member.id));
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