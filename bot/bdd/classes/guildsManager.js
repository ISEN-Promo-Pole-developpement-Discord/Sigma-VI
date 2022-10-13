const { Guild } = require("./guild.js");

/**
 * GuildsManager class
 * @class
 * @deprecated
 * @static
 */
class GuildsManager
{
    /**
     * Get a guild from its ID
     * @param {string|number} guild_id The guild's ID
     * @returns {Guild} The guild
     * @deprecated
     * @static
     * @async
     */
    static async getGuild(guild_id)
    {
        if(typeof guild_id !== "string" && typeof guild_id !== "number")
            throw new TypeError("guild_id must be a string or a number");
        const connection = global.sqlConnection;
        const query = "SELECT * FROM guild WHERE guild_id = ?";
        const values = [guild_id];
        const data = await connection(query, values);

        if (data.length === 0) return null;
        else
            return new Guild(guild_id);
    }

    /**
     * Add a guild to the database
     * @param {Guild} guild The guild to add
     * @deprecated
     * @static
     * @async
     * @returns {Promise<Guild>} The guild
     * @todo switch to guild_id
     */
    static async addGuild(guild)
    {
        if (!(guild instanceof Guild))
            throw new TypeError("guild must be a Guild");
        if (await this.getGuild(guild.id) !== null) return;
        const connection = global.sqlConnection;
        const query = "INSERT INTO guild (guild_id, config) VALUES(?, ?)";
        const values = [guild.id, guild.config];
        await connection(query, values);

        return new Guild(guild.id);
    }

    /**
     * Remove a guild from the database
     * @param {string|number} guild_id The guild's ID
     * @deprecated
     * @static
     * @async
     * @returns {Promise<void>}
     */
    static async deleteGuild(guild_id)
    {
        if(typeof guild_id !== "string" && typeof guild_id !== "number")
            throw new TypeError("guild_id must be a string or a number");
        if (await this.getGuild(guild_id) === null) return;
        const connection = global.sqlConnection;
        const query = "DELETE FROM guild WHERE guild_id = ?";
        await connection(query, guild_id);
    }
}

module.exports = { GuildsManager };