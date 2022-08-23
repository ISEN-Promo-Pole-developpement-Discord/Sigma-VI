class Form
{
    constructor(form_id) {
        this.form_id = form_id;
    }

    async getChannelID()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT channel_id FROM form WHERE form_id = ?", [this.form_id]
        );
        return rows[0].name;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT status FROM form WHERE form_id = ?", [this.form_id]
        );
        return rows[0].name;
    }

    async getVerificationCode(){
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT verification_code FROM form WHERE form_id = ?", [this.form_id]
        );
        return rows[0].name;
    }

    async setChannelID(channel_id)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET channel_id = ? WHERE form_id = ?`, [channel_id, this.form_id]);
    }

    async setStatus(status)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET status = ? WHERE form_id = ?`, [status, this.form_id]);
    }
    
    async generateVerificationCode(){
        const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
        await this.setVerificationCode(code);
        return code;
    }

    async setVerificationCode(verification_code)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET verification_code = ? WHERE form_id = ?`, [verification_code, this.form_id]);
    }
}

module.exports = {Form};