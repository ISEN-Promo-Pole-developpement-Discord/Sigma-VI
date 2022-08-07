class UserGuildStatus
{
    constructor(user_id, guild_id)
    {
        this.user_id = user_id;
        this.guild_id = guild_id;
    }

    // GETTERS
    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection.execute(
            "SELECT status FROM user_guild_status WHERE user_id = ? && guild_id = ?", [this.user_id], [this.guild_id]
        );
        return rows[0].status;
    }

    async getFormID()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection.execute(
            "SELECT form_id FROM user_guild_status WHERE user_id = ? && guild_id = ?", [this.user_id], [this.guild_id]
        );
        return rows[0].name;
    }

    // SETTERS
    setStatus()
    {
        const connection = global.sqlConnection;
        connection.query(`UPDATE user_guild_status SET status = ? WHERE user_id = ? && guild_id = ?, status, [this.user_id], [this.guild_id]`)
    }

    setFormID()
    {
        const connection = global.sqlConnection;
        connection.query(`UPDATE user_guild_status SET form_id = ? WHERE user_id = ? && guild_id = ?, form_id, [this.user_id], [this.guild_id]`)
    }
}

module.exports = {UserGuildStatus};