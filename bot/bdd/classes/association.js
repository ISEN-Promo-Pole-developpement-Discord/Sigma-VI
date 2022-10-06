const { ChannelType } = require('discord.js');


/**
 * Association class
 * @param {number} asso_id - The association's ID
 */
class Association
{
    constructor(asso_id) {
        this.id = asso_id;
    }

    /**
     * Get the association's name
     * @alias Association.getName
     * @returns {Promise<string>} The association's name
     * @async
     * @example
     * const association = await AssociationsManager.getAssociation("ISENPromo");
     * const name = await association.getName(); // "ISEN Promo"
     */
    async getName()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT name FROM association WHERE asso_id = ?", [this.id]
        );
        return rows.name;
    }

    /**
     * Get the association's description
     * @alias Association.getDescription
     * @returns {Promise<string>} The association's description
     * @async
     * @example
     * const association = await AssociationsManager.getAssociation("ISENPromo");
     * const description = await association.getDescription(); // Description of the association
     */
    async getDescription() {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT description FROM association WHERE asso_id = ?", [this.id]
        );
        return rows.description;
    }

    /**
     * Get the association's icon
     * @alias Association.getIcon
     * @returns {Promise<string>} The association's icon
     * @async
     * @example
     * const association = await AssociationsManager.getAssociation("ISENPromo");
     * const icon = await association.getIcon(); // Icon of the association
     */
    async getIcon()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT icon FROM association WHERE asso_id = ?", [this.id]
        );
        return rows.icon;
    }

    /**
     * Get the association's members
     * @alias Association.getMembers
     * @returns {Promise<Array<User>>} The association's members
     * @async
     * @example
     * const association = await AssociationsManager.getAssociation("ISENPromo");
     * const members = await association.getMembers(); // Array of members
     */
    async getMembers()
    {
        const connection = global.sqlConnection;
        const UsersManager = global.usersManager;
        const [rows] = await connection(
            "SELECT user_id FROM associations_roles WHERE asso_id = ?", [this.id]
        );
        let result = [];
        for(var id in rows)
            result.push(await UsersManager.getUser(id));
        return rows;
    }

    /**
     * Set the association's name
     * @alias Association.setName
     * @param {string} name - The new name
     * @returns {Promise<void>} completion
     * @async
     * @example
     * const association = await AssociationsManager.getAssociation("ISENPromo");
     * await association.setName("ISEN Promotion"); // Set the association's name to "ISEN Promo"
     * const name = await association.getName(); // "ISEN Promotion"
     * @throws {TypeError} The name must be a string
     * @throws {RangeError} The name must be between 1 and 255 characters
     * @throws {Error} The name is already used by another association
    */
    async setName(name)
    {
        if(typeof name !== "string")
            throw new TypeError("name must be a string");
        if(name.length < 1 || name.length > 255)
            throw new RangeError("name must be between 1 and 255 characters");
        if(await AssociationsManager.getAssociationByName(name) != null)
            throw new Error("The name is already used by another association");
        const connection = global.sqlConnection;
        return await connection(`UPDATE association SET name = ? WHERE asso_id = ?`, [name, this.id]);
    }

    /**
     * Set the association's description
     * @alias Association.setDescription
     * @param {string} description - The new description
     * @returns {Promise<void>} completion
     * @async
     * @example
     * const association = await AssociationsManager.getAssociation("ISENPromo");
     * await association.setDescription("Description of the association"); // Set the association's description
     * const description = await association.getDescription(); // "Description of the association"
     * @throws {TypeError} The description must be a string
     * @throws {RangeError} The description must be between 1 and 255 characters
    */
    async setDescription(description)
    {
        if(typeof description !== "string")
            throw new TypeError("description must be a string");
        if(description.length < 1 || description.length > 255)
            throw new RangeError("description must be between 1 and 255 characters");
        const connection = global.sqlConnection;
        return await connection(`UPDATE association SET description = ? WHERE asso_id = ?`, [description, this.id]);
    }

    /**
     * Set the association's icon
     * @alias Association.setIcon
     * @param {string} icon - The new icon
     * @returns {Promise<void>} completion
     * @async
     */
    async setIcon(icon)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE association SET icon = ? WHERE asso_id = ?`, [icon, this.id]);
    }
    /**
     * Add a member to the association
     * @alias Association.addMember
     * @param {string} userId - The user's ID
     * @param {number} role - The role of the user
     * @returns {Promise<boolean>} completion
     * @async
     */
    async addMember(userId, role = 0)
    {
        const UsersManager = global.usersManager;
        let user = await UsersManager.getUser(userId);
        if(user == null) return false;
        try{
            if(await user.getAssociationRole(this.id) != null) return false;
            return await user.setAssociationRole(this.id, role);
        } catch (e) {
            return false;
        }
    }

    /**
     * Remove a member from the association
     * @alias Association.removeMember
     * @param {string} userId - The user's ID
     * @returns {Promise<boolean>} completion
     * @async
    */
    async removeMember(userId)
    {
        const UsersManager = global.usersManager;
        let user = await UsersManager.getUser(userId);
        if(user == null) return false;
        try{
            return await user.removeAssociationRole(this.id);
        } catch (e) {
            return false;
        }
    }

    /**
     * Get the association's administrators channels
     * @alias Association.getRespoChannels
     * @returns {Promise<Array<Channel>>} The association's administrators channels
     * @async
     */
    async getRespoChannels()
    {   
        let guild = global.client.guilds.cache.get(global.config.core.mainGuildId);
        let respoChannelsObj = [];

        let guildChannels = await guild.channels.fetch();
        let channelsKeysToGet = ["respo", "bureau"];
        let assoCat = null;
        for (let category of guildChannels.values()) {
            if(category.type !== ChannelType.GuildCategory) continue;
            if(category.name.toLowerCase() === (await this.getName()).toLowerCase())
                assoCat = category.id;
        }
        for (let channel of guildChannels.values()) {
            if(channel.type !== ChannelType.GuildText) continue;
            if(channel.parentId != assoCat) continue;
            if(!channel.name) continue;
            for (let key of channelsKeysToGet) {
                if(channel.name.toLowerCase().includes(key))
                    respoChannelsObj.push(channel);
            }
        }
        return respoChannelsObj;
    }

    /**
     * Updates a an association's category and channels for a member
     * @alias Association.updateCategoryPermissionsForGuildMember
     * @param {GuildMember} member - The guild member
     * @returns {Promise<boolean>} completion
     * @async
     */
    async updateCategoryPermissionsForGuildMember(member)
    {
        const UsersManager = global.usersManager;
        let channelsToModify = await this.getRespoChannels();
        let user = await UsersManager.getUser(member.id);
        if(user == null) return false;
        let role = await user.getAssociationRole(this.id);
        if(role == null) return false;

        if (role === 0) {
            for (let channel of channelsToModify)
                await channel.permissionOverwrites.delete(member.id);
            return true;
        }

        for (let channel of channelsToModify) {
            await channel.permissionOverwrites.create(member, {
                ViewChannel: true,
            });
            return true;
        }
    }

}

module.exports = { Association };