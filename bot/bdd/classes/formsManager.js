const {Form} = require("./form.js");

class FormsManager
{
    static async getForm(form_id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM form WHERE form_id = ?";
        const data = await connection(query, [form_id]);

        if (data.length === 0) return null;
        else
            return new Form(user_id, guild_id, data[0].channel_id);
    }

    static async addForm(form)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO form (user_id, guild_id, channel_id, status) VALUES (?, ?, ?, ?)";
        const values = [form.user_id, form.guild_id, form.channel_id, form.status];
        await connection(query, values);

        return new Form(form.user_id, form.guild_id, form.channel_id);
    }
}

module.exports = {FormsManager};