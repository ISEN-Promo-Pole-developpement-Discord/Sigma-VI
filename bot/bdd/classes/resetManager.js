class ResetManager
{
    static async addUserToResetTable(user_id)
    {
        if (await this.getUserToReset(user_id) === null) {
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

    static async getUserToReset(user_id)
    {
        if (await this.getUserToReset(user_id) !== null) {
            const connection = global.sqlConnection;
            const query = "SELECT * FROM reset WHERE user_id = ?";
            const data = await connection(query, user_id);
            if (data.length === 0) return null;
            else return data;
        }
    }
}

module.exports = { ResetManager };