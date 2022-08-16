class Form
{
    constructor(user_id, guild_id, channel_id, status) {
        this.user_id = user_id;
        this.guild_id = guild_id;
        this.channel_id = channel_id;
        this.status = status;
    }

    async getID()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT form_id FROM form WHERE user_id = ? AND guild_id = ?", [this.user_id], [this.guild_id]
        );
        return rows[0].name;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT status FROM form WHERE user_id = ? AND guild_id  = ?", [this.user_id], [this.guild_id]
        );
        return rows[0].name;
    }

    setChannelID(channel_id)
    {
        const connection = global.sqlConnection;
        connection(`UPDATE form SET channel_id = ? WHERE user_id = ? AND guild_id = ?`, channel_id, [this.user_id], [this.guild_id]);
    }

    setStatus(status)
    {
        const connection = global.sqlConnection;
        connection(`UPDATE form SET status = ? WHERE user_id = ? AND guild_id = ?`, status, [this.user_id], [this.guild_id]);
    }
}

module.exports = {Form};