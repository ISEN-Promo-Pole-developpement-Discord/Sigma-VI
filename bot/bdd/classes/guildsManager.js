const { Guild } = require("./guild.js");

class GuildsManager {
    static addGuild(guild) {
        const connection = global.sqlConnection;
        const query = "INSERT INTO guild (guild_id, config) VALUES(?, ?)";
        const values = [guild.id, guild.config];
        connection(query, values);
    }
}

module.exports = { GuildsManager };