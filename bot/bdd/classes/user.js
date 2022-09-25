const associationsConfig = require("../../config-asso.json");
const { manageRoles } = require("../../utils/rolesManager");
const { AssociationsManager } = require("./associationsManager");
const { includedSimilarity } = require("../../requests/processors/stringIncludeSimilarity");

class User
{
    constructor(id) {
        this.id = id;
    }

    // GETTERS
    async getName()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT name FROM user WHERE user_id = ?", [this.id]
        );
        return rows.name;
    }

    async getSurname()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT surname FROM user WHERE user_id = ?", [this.id]
        );
        return rows.surname;
    }

    async getEmail()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT email FROM user WHERE user_id = ?", [this.id]
        );
        return rows.email;
    }
    
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

    async getPassword()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT password FROM user WHERE user_id = ?", [this.id]
        );
        return rows.password;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT status FROM user WHERE user_id = ?", [this.id]
        );
        return rows.status;
    }

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

    async getAssociationRole(asso_id)
    {
        const connection = global.sqlConnection;
        const rows = await connection("SELECT role FROM associations_user_role WHERE user_id = ? AND asso_id = ?", [this.id, asso_id]);
        if (rows.length === 0) return null;
        else return rows[0].role;
    }

    async getAssociationsRoles()
    {
        const connection = global.sqlConnection;
        const rows = await connection("SELECT * FROM associations_user_role WHERE user_id = ?", [this.id]);
        if (rows.length === 0) return [];
        else return rows;
    }

    async addRelatedAssociationGuildsRoles(asso_id){
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

    async removeRelatedAssociationGuildsRoles(asso_id){
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

    async updateAssociationsServerPermissions(){

        let mainGuild = global.client.guilds.cache.get(global.config.core.mainGuildId);
        let member = mainGuild.members.cache.get(this.id);

        // Fetch all associations_user_role of the user
        let userAssociationsRoles = await this.getAssociationsRoles();
        console.log(userAssociationsRoles);

        // LOAD ASSO CONFIG VARS
        const { memberRoleName, managerRoleName, treasurerRoleName, vicePresidentRoleName, presidentRoleName } = associationsConfig.RolesName;
        var roleRoleNameList = [memberRoleName, managerRoleName, treasurerRoleName, vicePresidentRoleName, presidentRoleName];

        let associations = await AssociationsManager.getAssociations();
        for(let association of associations){
            let userIsInAssociation = false;
            for(let assoRole of Object.values(userAssociationsRoles)){
                if(assoRole.asso_id == association.id){
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
            4: presidentRoleName
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

    // SETTERS
    async setName(name)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET name = ? WHERE user_id = ?`, [name, this.id]);
    }

    async setSurname(surname)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET surname = ? WHERE user_id = ?`, [surname, this.id]);
    }

    async setEmail(email)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET email = ? WHERE user_id = ?`, [email, this.id]);
    }

    async setPassword(password)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET password = ? WHERE user_id = ?`, [password, this.id]);
    }

    async setStatus(status)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET status = ? WHERE user_id = ?`, [status, this.id]);
    }

    async setData(data)
    {
        const connection = global.sqlConnection;
        const dataJSON = JSON.stringify(data);
        await connection(`UPDATE user SET user_data = ? WHERE user_id = ?`, [dataJSON, this.id]);
        
    }

    async setAssociationRole(asso_id, role)
    {
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

    async removeAssociationRole(asso_id){
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