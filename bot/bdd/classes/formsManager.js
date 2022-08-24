const {Form} = require("./form.js");

class FormsManager
{
    static async getForm(form_id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM form WHERE form_id = ?";
        const data = await connection(query, form_id);

        if (data.length === 0) return null;
        else
            return new Form(form_id);
    }

    static async addForm(form)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO form (user_id, guild_id, channel_id, status) VALUES (?, ?, ?, ?)";
        const values = [form.user_id, form.guild_id, form.channel_id, form.status];
        await connection(query, values);

        return new Form(form.user_id, form.guild_id, form.channel_id);
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
                formArray.push(await FormsManager.getForm(value.form_id));
            }
            return formArray;
        }
    }
}

module.exports = {FormsManager};