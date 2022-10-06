const {UserGuildStatus} = require("./userGuildStatus");

/**
 * UserGuildStatusManager class
 * @class
 * @static
 * @todo Should be integrated in User class
*/

class UserGuildStatusManager
{
    static async getUserGuildStatus(user)
    {
        const connection = global.sqlConnection;
         const query = "SELECT * FROM user_guild_status WHERE user_id = ? AND guild_id = ?";
         const values = [user.id, user.guild_id];
         const data = await connection(query, values);
         if (data.length === 0) return null;
         else
             return new UserGuildStatus(user.id, user.guild_id);
    }

    static async addUserGuildStatus(user)
    {
        const curentStatus = await this.getUserGuildStatus(user);
        
        if (curentStatus !== null){
            await curentStatus.setFormID(user.form_id);
            await curentStatus.setStatus(user.status);
            return curentStatus;
        }

        const connection = global.sqlConnection;
        const query = "INSERT INTO user_guild_status (user_id, guild_id, status, form_id) VALUES (?, ?, ?, ?)";
        const values = [user.id, user.guild_id, user.status, user.form_id];
        await connection(query, values);

        return await this.getUserGuildStatus(user);
    }
}

module.exports = {UserGuildStatusManager};