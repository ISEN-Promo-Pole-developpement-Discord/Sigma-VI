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
        const [rows] = await connection(
            "SELECT status FROM user_guild_status WHERE user_id = ? AND guild_id = ?", [this.user_id, this.guild_id]
        );
        return rows[0].status;
    }

    async getFormID()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection("SELECT form_id FROM user_guild_status WHERE user_id = ? AND guild_id = ?", [this.user_id, this.guild_id]);
        return rows[0].form_id;
    }

    // SETTERS
    async setStatus(status)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user_guild_status SET status = ? WHERE user_id = ? AND guild_id = ?`, [status, this.user_id, this.guild_id]);
    }

    async setFormID(form_id)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user_guild_status SET form_id = ? WHERE user_id = ? AND guild_id = ?`, [form_id, this.user_id, this.guild_id]);
    }
}

module.exports = {UserGuildStatus};