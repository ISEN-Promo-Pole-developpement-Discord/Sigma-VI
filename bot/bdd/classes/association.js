const { UsersManager } = require('./usersManager');
const { ChannelType } = require('discord.js');
class Association
{
    constructor(asso_id) {
        this.id = asso_id;
    }

    // GETTERS
    async getName()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT name FROM association WHERE asso_id = ?", [this.id]
        );
        return rows.name;
    }

    async getDescription() {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT description FROM association WHERE asso_id = ?", [this.id]
        );
        return rows.description;
    }

    async getIcon()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT icon FROM association WHERE asso_id = ?", [this.id]
        );
        return rows.icon;
    }

    async getMembers()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT user_id FROM associations_roles WHERE asso_id = ?", [this.id]
        );
        let result = [];
        for(var id in rows)
            result.push(await UsersManager.getUser(id));
        return rows;
    }

    // SETTERS
    async setName(name)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE association SET name = ? WHERE asso_id = ?`, [name, this.id]);
    }

    async setDescription(description)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE association SET description = ? WHERE asso_id = ?`, [description, this.id]);
    }

    async setIcon(icon)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE association SET icon = ? WHERE asso_id = ?`, [icon, this.id]);
    }

    async addMember(userId, role = 0)
    {
        let user = await UsersManager.getUser(userId);
        if(user == null) return false;
        try{
            if(await user.getAssociationRole(this.id) != null) return false;
            return await user.setAssociationRole(this.id, role);
        } catch (e) {
            return false;
        }
    }

    async removeMember(member)
    {
        let user = await UsersManager.getUser(member.id);
        if(user == null) return false;
        try{
            return await user.removeAssociationRole(this.id);
        } catch (e) {
            return false;
        }
    }

    async getRespoChannels()
    {   
        let guild = global.client.guilds.cache.get(global.config.core.mainGuildId);
        let respoChannelsObj = [];

        let guildChannels = await guild.channels.fetch();
        let channelsToGet = ["responsables", "bureau"];
        let assoCat = null;
        for (let category of guildChannels) {
            if(category.type !== ChannelType.GuildCategory) continue;
            if(category[1].name.toLowerCase() === (await this.getName()).toLowerCase())
                assoCat = category.id;
        }

        for (let i=0; i<channelsToGet.length; i++)
        {
            for (let channel of guildChannels) {
                if ((channel.name.toLowerCase() === channelsToGet[i]) && (channel.parentId === assoCat)) {
                    respoChannelsObj.push(channel);
                }
            }
        }
        return respoChannelsObj;
    }

    async updateCategoryPermissionsForGuildMember(member)
    {
        let channelsToModify = await this.getRespoChannels(member);
        let user = await UsersManager.getUser(member.id);
        if(user == null) return false;
        let role = await user.getAssociationRole(this.id);
        if(role == null) return false;

        if (role === 0) {
            for (let channel of channelsToModify)
                channel.permissionOverwrites.delete(member.id);
            return;
        }

        for (let channel of channelsToModify) {
            await channel.permissionOverwrites.create(member, {
                ViewChannel: true,
            });
        }
    }

}

module.exports = { Association };