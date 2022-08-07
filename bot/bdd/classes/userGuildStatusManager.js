const {UserGuildStatus} = require("./userGuildStatus");

class UserGuildStatusManager
{
    static addUserGuildStatus(status)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO user_guild_status (user_id, guild_id, status, form_id) VALUES (?, ?, ?, ?)";
        const values = [status.user_id, status.guild_id, status.status, status.id];
        connection.query(query, values);
    }
}

module.exports = {UserGuildStatusManager};