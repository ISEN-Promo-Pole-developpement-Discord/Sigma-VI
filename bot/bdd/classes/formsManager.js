const {Form} = require("./form.js");

class FormsManager
{
    static async getForm(guild_id, channel_id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM form WHERE guild_id = ? AND channel_id = ?";
        const values = [guild_id, channel_id];
        const data = await connection(query, values);

        if (data.length === 0) return null;
        else
            return new Form(data[0].form_id);
    }

    static async getFormById(form_id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM form WHERE form_id = ?";
        const values = [form_id];
        const data = await connection(query, values);

        if (data.length === 0) return null;
        else
            return new Form(data[0].form_id);
    }

    static async searchForms(user_id, guild_id)
    {
        const connection = global.sqlConnection;
        let query = "SELECT * FROM form WHERE user_id = ? AND guild_id = ?";
        let values = [user_id, guild_id];

        const data = await connection(query, values);

        if (data.length === 0) return null;
        else
        {
            let formArray = [];
            for (const value of data) {
                formArray.push(await FormsManager.getFormById(value.form_id));
            }
            return formArray;
        }
    }

    static async addForm(form)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO form (user_id, guild_id, channel_id, status, verification_code, fields) VALUES (?, ?, ?, ?, null, ?)";
        const values = [form.user_id, form.guild_id, form.channel_id, form.status, JSON.stringify(form.fields)];
        await connection(query, values);

        return await this.getForm(form.guild_id, form.channel_id);
    }

    static async deleteForm(form_id)
    {
        const form = await this.getFormById(form_id);
        if(form) form.delete();
    }
}

module.exports = {FormsManager};