/**
 * Guild class
 * @class
 * @param {string} guild_id - The guild's ID
 * @deprecated
 */
class Guild
{
    constructor(guild_id) {
        this.guild_id = guild_id;
    }

    /**
     * Get the guild's config
     * @returns {Promise<object>} The guild's config
     * @deprecated
     * @async
     */
    async getConfig() {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT config FROM guild WHERE guild_id = ?", [this.guild_id]
        );
        return rows.config;
    }

    /**
     * Set the guild's config
     * @param {object} config - The guild's config
     * @deprecated
     * @async
     * @returns {Promise<void>}
     */
    async setConfig(config)
    {
        if(typeof config !== "object")
            throw new TypeError("config must be an object");
        const connection = global.sqlConnection;
        await connection(`UPDATE guild SET config = ? WHERE guild_id = ?`, [config, this.guild_id]);
    }
}

module.exports = {Guild};