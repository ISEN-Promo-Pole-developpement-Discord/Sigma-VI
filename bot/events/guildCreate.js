const db = require("../bdd/utilsDB");

module.exports = {
    name: "guildCreate",
    once: false,
    execute(guild) {
        /**
         * Triggered when a user invites the bot onto his server
         * @param {Guild} guild The guild the bot got invited to
         * @event guildCreate
         * @returns {Promise<void>}
         */

        // VERIF
        db.connection.query(`SELECT * FROM guild WHERE guild_id = "${guild.id}"`, function (err, row)
        {
           if (err) throw err;
           else
               if (!(row && row.length))
                   db.connection.query(`INSERT INTO guild(guild_id, config) VALUES("${guild.id}", "{}")`);
        });
    }
}