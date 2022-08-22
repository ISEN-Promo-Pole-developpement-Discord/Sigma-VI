class Form
{
    constructor(user_id, guild_id, channel_id) {
        this.user_id = user_id;
        this.guild_id = guild_id;
        this.channel_id = channel_id;
    }

    async getID()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT form_id FROM form WHERE user_id = ? AND guild_id = ?", [this.user_id, this.guild_id]
        );
        return rows[0].name;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT status FROM form WHERE user_id = ? AND guild_id  = ?", [this.user_id, this.guild_id]
        );
        return rows[0].name;
    }

    async getVerificationCode(){
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT verification_code FROM form WHERE user_id = ? AND guild_id  = ?", [this.user_id, this.guild_id]
        );
        return rows[0].name;
    }

    async setChannelID(channel_id)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET channel_id = ? WHERE user_id = ? AND guild_id = ?`, [channel_id, this.user_id, this.guild_id]);
    }

    async setStatus(status)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET status = ? WHERE user_id = ? AND guild_id = ?`, [status, this.user_id, this.guild_id]);
    }
    
    async generateVerificationCode(){
        const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
        await this.setVerificationCode(code);
        return code;
    }

    async setVerificationCode(verification_code)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET verification_code = ? WHERE user_id = ? AND guild_id = ?`, [verification_code, this.user_id, this.guild_id]);
    }
}

module.exports = {Form};