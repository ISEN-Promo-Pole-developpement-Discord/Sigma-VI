const { User } = require("discord.js");

/**
 * Form class
 * @class
 * @param {number|string} form_id The form id
 */
class Form
{
    constructor(form_id) {
        if(typeof form_id !== "number" && typeof form_id !== "string")
            throw new Error("form_id must be a number or a string");
        this.form_id = form_id;
    }

    /**
     * Get the form's channel id
     * @alias Form.getChannelID
     * @returns {Promise<string>} The channel id
     * @async
     */
    async getChannelID()
    {
        const connection = global.sqlConnection;
        const [row] = await connection(
            "SELECT channel_id FROM form WHERE form_id = ?", [this.form_id]
        );
        return row.channel_id;
    }

    /**
     * Get the form's completion status
     * @alias Form.getStatus
     * @returns {Promise<string>} The form's completion status
     * @async
     */
    async getStatus()
    {
        const connection = global.sqlConnection;
        const [row] = await connection(
            "SELECT status FROM form WHERE form_id = ?", [this.form_id]
        );
        return row.status;
    }

    /**
     * Get the form's mail verification code
     * @alias Form.getVerificationCode
     * @returns {Promise<string>} The form's mail verification code
     * @async
     */
    async getVerificationCode(){
        const connection = global.sqlConnection;
        const [row] = await connection(
            "SELECT verification_code FROM form WHERE form_id = ?", [this.form_id]
        );
        return row.verification_code;
    }

    /**
     * Get the form's discord user
     * @alias Form.getUser
     * @returns {Promise<User>} The form's discord user
     * @async
     */
    async getUser(){
        const connection = global.sqlConnection;
        const [row] = await connection(
            "SELECT user_id FROM form WHERE form_id = ?", [this.form_id]
        );
        return await global.client.users.fetch(row.user_id);
    }

    /**
     * Get the form's fields
     * @alias Form.getFields
     * @returns {Promise<Object>} The form's fields
     * @async
    */
    async getFields()
    {
        const connection = global.sqlConnection;
        const [row] = await connection(
            "SELECT fields FROM form WHERE form_id = ?", [this.form_id]
        );
        
        if(row.fields != null){
            if(typeof row.fields === "string"){
                return JSON.parse(row.fields);
            }
            else{
                return row.fields;
            }
        }
    }

    /**
     * Set the form's channel id
     * @alias Form.setChannelID
     * @param {string} channel_id The channel id
     * @returns {Promise<void>} Completion promise
     * @async
     */
    async setChannelID(channel_id)
    {
        if(typeof channel_id !== "string")
            throw new Error("channel_id must be a string");
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET channel_id = ? WHERE form_id = ?`, [channel_id, this.form_id]);
    }

    /**
     * Set the form's completion status
     * @alias Form.setStatus
     * @param {string|number} status The form's completion status
     * @returns {Promise<void>} Completion promise
     * @async
     */
    async setStatus(status)
    {
        if(typeof status !== "string" && typeof status !== "number")
            throw new Error("status must be a string or a number");
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET status = ? WHERE form_id = ?`, [status, this.form_id]);
    }
    
    /** Generate form's mail generation code
     * @alias Form.generateVerificationCode
     * @returns {Promise<number>} The form's mail verification code
     * @async
     */
    async generateVerificationCode(){
        const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
        await this.setVerificationCode(code);
        return code;
    }

    /**
     * Set the form's mail verification code
     * @alias Form.setVerificationCode
     * @param {string|number} code The form's mail verification code
     * @returns {Promise<void>} Completion promise
     * @async
     */
    async setVerificationCode(code)
    {
        if(typeof code !== "string" && typeof code !== "number")
            throw new Error("verification_code must be a string or a number");
        const connection = global.sqlConnection;
        await connection(`UPDATE form SET code = ? WHERE form_id = ?`, [code, this.form_id]);
    }
    
    /**
     * Check the form's mail verification code
     * @alias Form.checkVerificationCode
     * @param {string|number} code The verification code to check
     * @returns {Promise<boolean>} The verification result
     */
    async checkVerificationCode(code){
        if(typeof code !== "string" && typeof code !== "number")
            throw new Error("code must be a string or a number");
        const verification_code = await this.getVerificationCode();
        return verification_code == code;
    }


    /**
     * Set the form's fields
     * @alias Form.setFields
     * @param {Object} fields The form's fields
     * @returns {Promise<void>} Completion promise
     * @async
     */
    async setFields(fields)
    {
        if(typeof fields !== "object")
            throw new Error("fields must be an object");
        const connection = global.sqlConnection;
        var fields_json = JSON.stringify(fields);
        await connection(`UPDATE form SET fields = ? WHERE form_id = ?`, [fields_json, this.form_id]);
    }

    /**
     * register a form field
     * @alias Form.registerField
     * @param {string} id The field id
     * @param {*} value The field value
     * @returns {Promise<void>} Completion promise
     * @async
     */
    async registerField(id, value) {
        let fields = await this.getFields();
        fields[id] = value;
        return this.setFields(fields);
    }

    /**
     * Delete the form
     * @alias Form.delete
     * @returns {Promise<void>} Completion promise
     * @async
     */
    async delete(){
        const connection = global.sqlConnection;
        const channel_id = await this.getChannelID();
        let channel = global.client.channels.cache.get(channel_id);
        if(channel){
            await channel.delete();
        }
        return await connection(`DELETE FROM form WHERE form_id = ?`, [this.form_id]);
    }
}

module.exports = {Form};
