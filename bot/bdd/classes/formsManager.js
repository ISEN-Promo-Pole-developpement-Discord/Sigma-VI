const {Form} = require("./form.js");

/**
 * FormsManager class
 * @class
 * @static
 */
class FormsManager
{
    /**
     * Get a form by its guild_id and channel_id
     * @alias FormsManager.getForm
     * @param {string} guild_id - The guild id
     * @param {string} channel_id - The channel id
     * @returns {Promise<Form|null>} The form
     * @async
     */
    static async getForm(guild_id, channel_id)
    {
        if(typeof guild_id !== "string" || typeof channel_id !== "string")
            throw new Error("guild_id and channel_id must be strings");
        const connection = global.sqlConnection;
        const query = "SELECT * FROM form WHERE guild_id = ? AND channel_id = ?";
        const values = [guild_id, channel_id];
        const data = await connection(query, values);

        if (data.length === 0) return null;
        else
            return new Form(data[0].form_id);
    }

    /**
     * Get a form by its id
     * @alias FormsManager.getFormByID
     * @param {number|string} form_id - The form id
     * @returns {Promise<Form|null>} The form
     * @async
     */
    static async getFormById(form_id)
    {
        if(typeof form_id !== "number" && typeof form_id !== "string")
            throw new Error("form_id must be a number or a string");

        const connection = global.sqlConnection;
        const query = "SELECT * FROM form WHERE form_id = ?";
        const values = [form_id];
        const data = await connection(query, values);

        if (data.length === 0) return null;
        else
            return new Form(data[0].form_id);
    }

    /**
     * search forms for a user in a guild
     * @alias FormsManager.searchForms
     * @param {string} guild_id - The guild id
     * @param {string} user_id - The user id
     * @returns {Promise<Array<Form>>} The forms found
     * @async
     */
    static async searchForms(user_id, guild_id)
    {
        if(typeof guild_id !== "string" || typeof user_id !== "string")
            throw new Error("guild_id and user_id must be strings");
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

    /**
     * add a form
     * @alias FormsManager.addForm
     * @param {object} form - The form's data
     * @param {string} form.guild_id - The guild id
     * @param {string} form.channel_id - The channel id
     * @param {string} form.user_id - The user id
     * @param {string|number} form.status - The form's status
     * @param {object} form.fields - The form's fields
     * @returns {Promise<Form>} The form
     * @async
     */
    static async addForm(form)
    {
        if (typeof form !== "object")
            throw new Error("The form must be an object");
        if (typeof form.guild_id !== "string")
            throw new Error("The form's guild_id must be a string");
        if (typeof form.channel_id !== "string")
            throw new Error("The form's channel_id must be a string");
        if (typeof form.user_id !== "string")
            throw new Error("The form's user_id must be a string");
        if (typeof form.status !== "string" && typeof form.status !== "number")
            throw new Error("The form's status must be a string or a number");
        const connection = global.sqlConnection;
        const query = "INSERT INTO form (user_id, guild_id, channel_id, status, verification_code, fields) VALUES (?, ?, ?, ?, null, ?)";
        const values = [form.user_id, form.guild_id, form.channel_id, form.status, JSON.stringify(form.fields)];
        await connection(query, values);

        return await this.getForm(form.guild_id, form.channel_id);
    }

    /**
     * delete a form
     * @alias FormsManager.deleteForm
     * @param {string|number} form_id - The form id
     * @returns {Promise<void>} - Completion
     * @async
     */
    static async deleteForm(form_id)
    {
        if(typeof form_id !== "number" && typeof form_id !== "string")
            throw new Error("form_id must be a number or a string");
        const form = await this.getFormById(form_id);
        if(form) form.delete();
    }
}

module.exports = {FormsManager};