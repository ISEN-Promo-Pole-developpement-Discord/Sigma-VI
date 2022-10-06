/**
 * ResetManager class
 * @deprecated
 */

class ResetManager
{
    static async addUserToResetTable(user_id)
    {
        if (await this.isUserInResetTable(user_id) === false) {
            const connection = global.sqlConnection;
            const query = "INSERT INTO reset (user_id) VALUES (?)";
            await connection(query, user_id);
        }
    }

    static async removeUserFromResetTable(user_id)
    {
        const connection = global.sqlConnection;
        const query = "DELETE FROM reset WHERE user_id = ?";
        await connection(query, user_id);
    }

    static async isUserInResetTable(user_id){
        const connection = global.sqlConnection;
        const query = "SELECT * FROM reset WHERE user_id = ?";
        const result = await connection(query, user_id);
        return result.length > 0;
    }
}

module.exports = { ResetManager };