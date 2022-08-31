const associationsConfig = require("../../config-asso.json");
const { manageRoles } = require("../../utils/rolesManager");
const { AssociationsManager } = require("./associationsManager");
const { includedSimilarity } = require("../../requests/processors/stringIncludeSimilarity");

/**
 * User class
 * @class
 * @param {string} id The discord user's ID
 */
class User
{
    constructor(id) {
        this.id = id;
    }

    /**
     * Get the user's name
     * @alias User.getName
     * @returns {Promise<string>} The user's name
     * @async
     */
    async getName()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT name FROM user WHERE user_id = ?", [this.id]
        );
        return rows.name;
    }

    /**
     * get the user's surname
     * @alias User.getSurname
     * @returns {Promise<string>} The user's surname
     * @async
     */
    async getSurname()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT surname FROM user WHERE user_id = ?", [this.id]
        );
        return rows.surname;
    }

    /**
     * Get the user's email
     * @alias User.getEmail
     * @returns {Promise<string>} The user's email
     * @async
     */
    async getEmail()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT email FROM user WHERE user_id = ?", [this.id]
        );
        return rows.email;
    }
    
    /**
     * Get user's Ical URL
     * @alias User.getIcalURL
     * @returns {Promise<string|null>} The user's Ical URL
     * @async
     */
    async getIcalURL(){
        const name = await this.getName();
        const surname = await this.getSurname();
        if(name != null && surname != null){
            const formatedName = name.toLowerCase().normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").replaceAll(" ","-");
            const formatedSurname = surname.toLowerCase().normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").replaceAll(" ","-");
            const URL = `https://ent-toulon.isen.fr/webaurion/ICS/${formatedName}.${formatedSurname}.ics`;
            return URL;
        }
        return null;
    }
    
    /**
     * Get the user's password
     * @alias User.getPassword
     * @returns {Promise<string>} The user's password
     * @async
     * @deprecated
     */
    async getPassword()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT password FROM user WHERE user_id = ?", [this.id]
        );
        return rows.password;
    }

    /**
     * Get the user's status
     * @alias User.getStatus
     * @returns {Promise<string>} The user's status
     * @async
     */
    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT status FROM user WHERE user_id = ?", [this.id]
        );
        return rows.status;
    }

    /**
     * Get the user's data
     * @alias User.getData
     * @returns {Promise<Object>} The user's data
     * @async
     */
    async getData()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT user_data FROM user WHERE user_id = ?", [this.id]
        );
        if(rows.user_data != null){
            if(typeof rows.user_data === "string"){
                return JSON.parse(rows.user_data);
            }
            else{
                return rows.user_data;
            }
        }
    }

    /**
     * Get the user's association role
     * @alias User.getAssociationRole
     * @param {string|number} asso_id The association's ID
     * @returns {Promise<string>} The user's association role
     * @async
     */
    async getAssociationRole(asso_id)
    {
        if(typeof asso_id !== "string" && typeof asso_id !== "number")
            throw new Error("The association's ID must be a string or a number");
        const connection = global.sqlConnection;
        const rows = await connection("SELECT role FROM associations_user_role WHERE user_id = ? AND asso_id = ?", [this.id, asso_id]);
        if (rows.length === 0) return null;
        else return rows[0].role;
    }

    /**
     * Get the user's association roles
     * @alias User.getAssociationRoles
     * @returns {Promise<Array<string|number>>} The user's association roles
     * @async
     */
    async getAssociationsRoles()
    {
        const connection = global.sqlConnection;
        const rows = await connection("SELECT * FROM associations_user_role WHERE user_id = ?", [this.id]);
        if (rows.length === 0) return [];
        else return rows;
    }

    /**
     * Add all roles related to the user's association
     * @alias User.addRelatedAssociationGuildsRoles
     * @param {string|number} asso_id The association's ID
     * @returns {Promise<void>} Confirmation
     * @async
     */
    async addRelatedAssociationGuildsRoles(asso_id){
        if(typeof asso_id !== "string" && typeof asso_id !== "number")
            throw new Error("The association's ID must be a string or a number");
        const guilds = global.client.guilds.cache;
        let asso = await AssociationsManager.getAssociationByID(asso_id);
        if(asso == null) return false;
        for (let guild of guilds.values())
        {
            let member = guild.members.cache.get(this.id);
            if(member == null) continue;
            let verifiedRole = member.roles.cache.filter(role => role.name == global.config.core.verifiedRoleName).first();
            if(verifiedRole == null) continue;
            let assoName = await asso.getName();
            let roles = guild.roles.cache.filter(role => includedSimilarity(role.name, assoName)==1);
            let promises = [];
            for(let role of roles.values()) promises.push(member.roles.add(role));
            await Promise.all(promises);
        }
    }

    /**
     * Remove all roles related to the user's association
     * @alias User.removeRelatedAssociationGuildsRoles
     * @param {string|number} asso_id The association's ID
     * @returns {Promise<void>} Confirmation
     * @async
     */
    async removeRelatedAssociationGuildsRoles(asso_id){
        if(typeof asso_id !== "string" && typeof asso_id !== "number")
            throw new Error("The association's ID must be a string or a number");
        const guilds = global.client.guilds.cache;
        let asso = await AssociationsManager.getAssociationByID(asso_id);
        if(asso == null) return false;
        for (let guild of guilds.values())
        {
            let member = guild.members.cache.get(this.id);
            if(member == null) continue;
            let assoName = await asso.getName();
            let roles = member.roles.cache.filter(role => includedSimilarity(role.name, assoName)==1);
            let promises = [];
            for(let role of roles.values()) promises.push(member.roles.remove(role));
            await Promise.all(promises);
        }
    }

    /**
     * Update the user's permissions based on his association roles
     * @alias User.updateAssociationsServerPermissions
     * @returns {Promise<void>} Confirmation
     * @async
     * @todo ***Rename the function to updateAssociationsGuildsPermissions***
     */
    async updateAssociationsServerPermissions(){

        let mainGuild = global.client.guilds.cache.get(global.config.core.mainGuildId);
        let member = mainGuild.members.cache.get(this.id);

        // Fetch all associations_user_role of the user
        let userAssociationsRoles = await this.getAssociationsRoles();

        // LOAD ASSO CONFIG VARS
        const { memberRoleName, managerRoleName, treasurerRoleName, secretaryRoleName, vicePresidentRoleName, presidentRoleName } = associationsConfig.RolesName;
        var roleRoleNameList = [memberRoleName, managerRoleName, treasurerRoleName, secretaryRoleName, vicePresidentRoleName, presidentRoleName];

        let associations = await AssociationsManager.getAssociations();
        for(let association of associations){
            let userIsInAssociation = false;
            for(let assoRole of Object.values(userAssociationsRoles)){
                if(assoRole.asso_id === association.id){
                    userIsInAssociation = true;
                    break;
                }
            }
            if(userIsInAssociation) this.addRelatedAssociationGuildsRoles(association.id);
            else this.removeRelatedAssociationGuildsRoles(association.id);
        }

        let roleCount = [0, 0, 0, 0, 0];
        for(let assoRole of Object.values(userAssociationsRoles)) roleCount[assoRole.role]++;

        const values = {
            0: memberRoleName,
            1: managerRoleName,
            2: treasurerRoleName,
            3: vicePresidentRoleName,
            4: presidentRoleName,
            5: treasurerRoleName
            // TODO: Need to exchange president and secretary ids
        }

        let addRolesArray = [];
        for(let i=0; i<5; i++) if(roleCount[i] > 0) addRolesArray.push(values[i]);

        let removeRolesArray = [];
        for(let i=0; i<5; i++) if(roleCount[i] == 0) removeRolesArray.push(values[i]);

        await manageRoles(member, removeRolesArray, 1);
        await manageRoles(member, addRolesArray, 0);

        for (let asso in userAssociationsRoles)
        {
            let association = await AssociationsManager.getAssociationByID(userAssociationsRoles[asso].asso_id);
            await association.updateCategoryPermissionsForGuildMember(member);
        }
        return true;
    }

    /**
     * Set the user's name
     * @alias User.setName
     * @param {string} name The user's name
     * @returns {Promise<void>} Confirmation
     * @async
     */
    async setName(name)
    {
        if(typeof name !== "string")
            throw new Error("The user's name must be a string");
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET name = ? WHERE user_id = ?`, [name, this.id]);
    }

    /**
     * Set the user's surname
     * @alias User.setSurname
     * @param {string} surname The user's surname
     * @returns {Promise<void>} Confirmation
     * @async
     */
    async setSurname(surname)
    {
        if(typeof surname !== "string")
            throw new Error("The user's surname must be a string");
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET surname = ? WHERE user_id = ?`, [surname, this.id]);
    }

    /**
     * Set the user's email
     * @alias User.setEmail
     * @param {string} email The user's email
     * @returns {Promise<void>} Confirmation
     * @async
     */
    async setEmail(email)
    {
        if(typeof email !== "string")
            throw new Error("The user's email must be a string");
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET email = ? WHERE user_id = ?`, [email, this.id]);
    }

    /**
     * Set the user's password
     * @alias User.setPassword
     * @param {string} password The user's password
     * @returns {Promise<void>} Confirmation
     * @async
     * @deprecated
     */
    async setPassword(password)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET password = ? WHERE user_id = ?`, [password, this.id]);
    }

    /**
     * Set the user's status
     * @alias User.setStatus
     * @param {string|number} status The user's status
     * @returns {Promise<void>} Confirmation
     * @async
     */
    async setStatus(status)
    {
        if(typeof status !== "string" && typeof status !== "number")
            throw new Error("The user's status must be a string or a number");
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET status = ? WHERE user_id = ?`, [status, this.id]);
    }

    /**
     * Set the user's dataFields
     * @alias User.setData
     * @param {string | Object} data The user's dataFields
     * @returns {Promise<void>} Confirmation
     * @async
     */
    async setData(data)
    {
        if(typeof data !== "string" && typeof data !== "object")
            throw new Error("data must be a string or an object");
        const connection = global.sqlConnection;
        const dataJSON = typeof data !== "string" ? JSON.stringify(data) : data;
        await connection(`UPDATE user SET user_data = ? WHERE user_id = ?`, [dataJSON, this.id]);
    }

    /**
     * Set the user's association role
     * @alias User.setAssociationRole
     * @param {number|string} asso_id The association's id
     * @param {number|string} role The user's role
     * @returns {Promise<void>} Confirmation
     * @async
     */

    async setAssociationRole(asso_id, role)
    {
        if(typeof asso_id !== "number" && typeof asso_id !== "string")
            throw new Error("The association's id must be a number or a string");
        if(typeof role !== "number" && typeof role !== "string")
            throw new Error("The user's role must be a number or a string");

        const connection = global.sqlConnection;
        try{
            if(await this.getAssociationRole(asso_id) === null){
                await connection("INSERT INTO associations_user_role (user_id, asso_id, role) VALUES (?, ?, ?)", [this.id, asso_id, role]);
            }else{
                await connection(`UPDATE associations_user_role SET role = ? WHERE user_id = ? AND asso_id = ?`, [role, this.id, asso_id]);
            }
            await this.updateAssociationsServerPermissions();
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    /**
     * Remove the user's association role
     * @alias User.removeAssociationRole
     * @param {number|string} asso_id The association's id
     * @returns {Promise<void>} Confirmation
     * @async
     */
    async removeAssociationRole(asso_id){
        if(typeof asso_id !== "number" && typeof asso_id !== "string")
            throw new Error("The association's id must be a number or a string");

        const connection = global.sqlConnection;
        try{
            await this.setAssociationRole(asso_id, 0);
            await connection("DELETE FROM associations_user_role WHERE user_id = ? AND asso_id = ?", [this.id, asso_id]);
            await this.updateAssociationsServerPermissions();
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }
}

module.exports = {User};