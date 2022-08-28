const AssoRoles = require('./asso_roles');

class AssoRolesManager
{
    static async getAssoRoles(user_id, asso_id)
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT * FROM asso_roles WHERE user_id = ? AND asso_id = ?", [user_id, asso_id]
        );
        if (rows.length === 0) return null;
        else
            return new AssoRoles(user_id, asso_id);
    }

    static async addAssoRoles(assoRoles)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO asso_roles (user_id, asso_id, role) VALUES (?, ?, ?)";
        const values = [assoRoles.user_id, assoRoles.asso_id, assoRoles.role];
        await connection(query, values);
        return new AssoRoles(assoRoles.user_id, assoRoles.asso_id);
    }

    static async deleteAssoRoles(user_id, asso_id)
    {
        const connection = global.sqlConnection;
        const query = "DELETE FROM asso_roles WHERE user_id = ? AND asso_id = ?";
        const values = [user_id, asso_id];
        await connection(query, values);
    }
}