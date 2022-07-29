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

                if (!(row && row.length)) db.connection.query(`INSERT INTO user(user_id, name, surname, status, user_data) VALUES('${member.id}', '', '', -1, '{}')`);
                else {} // TODO : Need to change user status in table USER_GUILD_STATUS from 4 (leaved) to 1 (await form)}
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