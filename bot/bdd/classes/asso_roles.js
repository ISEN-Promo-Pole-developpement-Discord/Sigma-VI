class AssoRoles
{
    constructor(user_id, asso_id) {
        this.user_id = user_id;
        this.asso_id = asso_id;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT status FROM asso_roles WHERE user_id = ? AND asso_id = ?", [this.user_id, this.asso_id]
        );
        return rows[0].role;
    }

    async setStatus(status)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE asso_roles SET status = ? WHERE user_id = ? AND asso_id = ?`, [status, this.user_id, this.asso_id]);
    }
}

module.exports = {AssoRoles};