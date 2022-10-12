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

    async getConfig() {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT config FROM guild WHERE guild_id = ?", [this.guild_id]
        );
        return rows.config;
    }

    async setConfig(config)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE guild SET config = ? WHERE guild_id = ?`, [config, this.guild_id]);
    }
}

module.exports = {Guild};