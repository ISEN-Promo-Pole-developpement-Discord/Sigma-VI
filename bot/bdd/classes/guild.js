class Guild
{
    construction(guild_id) {
        this.guild_id = guild_id;
    }

    // GETTERS
    async getConfig() {
        const connection = global.sqlConnection;
        const [rows] = await connection.execute(
            "SELECT config FROM guild WHERE guild_id = ?", [this.guild_id]
        );
        return rows[0].config;
    }

    // SETTERS
    setConfig(config)
    {
        const connection = global.sqlConnection;
        connection.query(`UPDATE guild SET config = ? WHERE guild_id = ?`, config, [this.guild_id]);
    }
}

module.exports = {Guild};