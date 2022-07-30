const {logCreate} = require('../modtools/log/log-admin.js');
const {createChannel} = require('../utils/config-forms.js');
const db = require("../bdd/utilsDB");


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
         // VERIFICATION : DOES THE USER ALREADY GOT A LINE IN user TABLE ?
        db.connection.query(`SELECT * FROM user WHERE user_id = ${member.id}`, function(err, row)
        {
            if (err) {
                console.log("ERROR IN DB");
                console.log(err);
            }
            else {
                // If there is no data in db for this user

                if (!(row && row.length))
                {
                    db.connection.query(`INSERT INTO user(user_id, name, surname, status, user_data) VALUES('${member.id}', '', '', -1, '{}')`);
                    db.connection.query(`INSERT INTO user_guild_status(user_id, guild_id, status, form_id) VALUES('${member.id}', '${member.guild.id}', 0, null)`);
                    // TODO : Need to implement the form_id
                }
                else {
                    db.connection.query(`UPDATE user_guild_status SET status = 0 WHERE user_id = "${member.id}" && guild_id = "${member.guild.id}"`);
                } // TODO : Need to implement the change of form_id
            }
        });
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