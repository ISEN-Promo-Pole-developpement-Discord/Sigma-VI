const {Form} = require("./form.js");
const {User} = require("./user");

class FormsManager
{
    static async getForm(user_id, guild_id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM form WHERE user_id = ? AND guild_id = ?";
        const data = await connection(query, args.user_id, args.guild_id, (err, result) => {
            if (err) throw err;
            else return result;
        });

        if (data.length === 0) return null;
        else
            return new Form(user_id, guild_id, data[0].channel_id, data[0].status);
    }

    static async addForm(form)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO form (user_id, guild_id, channel_id, status) VALUES (?, ?, ?, ?,)";
        const values = [form.user_id, form.guild_id, form.channel_id, form.status];
        await connection(query, values);

        return new Form(form.user_id, form.guild_id, form.channel_id, form.status);
    }
}

module.exports = {FormsManager};