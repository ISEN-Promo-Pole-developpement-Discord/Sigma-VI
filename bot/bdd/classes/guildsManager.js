const { Guild } = require("./guild.js");

class GuildsManager
{
    static async getGuild(guild_id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM guild WHERE guild_id = ?";
        const values = [guild_id];
        const data = await connection(query, values);

        if (data.length === 0) return null;
        else
            return new Guild(guild_id);
    }

    static async addGuild(guild)
    {
        if (await this.getGuild(guild.id) !== null) return;
        const connection = global.sqlConnection;
        const query = "INSERT INTO guild (guild_id, config) VALUES(?, ?)";
        const values = [guild.id, guild.config];
        await connection(query, values);

        return new Guild(guild.id);
    }

    static async deleteGuild(guild_id)
    {
        if (await this.getGuild(guild_id) === null) return;
        const connection = global.sqlConnection;
        const query = "DELETE FROM guild WHERE guild_id = ?";
        await connection(query, guild_id);
    }
}

module.exports = { GuildsManager };