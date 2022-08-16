const {UserGuildStatus} = require("./userGuildStatus");

class UserGuildStatusManager
{
    static async getUserGuildStatus(user)
    {
        const connection = global.sqlConnection;
         const query = "SELECT * FROM user_guild_status WHERE user_id = ? AND guild_id = ?";
         const data = await connection(query, user.id, user.guild_id, (err, result) => {
             if  (err) throw err;
             else return result;
         });
         if (data.length === 0) return null;
         else
             return new UserGuildStatus(user.id, user.guild_id, data[0].status, data[0].form_id);
    }

    static async addUserGuildStatus(user)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO user_guild_status (user_id, guild_id, status, form_id) VALUES (?, ?, ?, ?)";
        const values = [user.id, user.guild_id, user.status, user.form_id];
        await connection(query, values);
    }
}

module.exports = {UserGuildStatusManager};