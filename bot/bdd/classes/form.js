class Form
{
    constructor(form_id) {
        this.form_id = form_id;
    }

    async getChannelID()
    {
        const connection = global.sqlConnection;
        const channel_id = await connection(
            "SELECT channel_id FROM form WHERE form_id = ?", [this.form_id]
        );
        return channel_id;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const status = await connection(
            "SELECT status FROM form WHERE form_id = ?", [this.form_id]
        );
        return status;
    }

    async getVerificationCode(){
        const connection = global.sqlConnection;
        const verification_code = await connection(
            "SELECT verification_code FROM form WHERE form_id = ?", [this.form_id]
        );
        return verification_code;
    }

    async getFields()
    {
        console.log(this.form_id);
        const connection = global.sqlConnection;
        const fields = await connection(
            "SELECT fields FROM form WHERE form_id = ?", [this.form_id]
        );

        return fields;
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

    async setFields(fields)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET fields = ? WHERE form_id = ?`, [fields, this.form_id]);
    }
}

module.exports = {Form};