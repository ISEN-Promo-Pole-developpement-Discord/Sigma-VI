class Association
{
    constructor(asso_id) {
        this.asso_id = asso_id;
    }

    // GETTERS
    async getName()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT name FROM association WHERE asso_id = ?", [this.asso_id]
        );
        return rows.name;
    }

    async getDescription() {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT description FROM association WHERE asso_id = ?", [this.asso_id]
        );
        return rows.description;
    }

    async getIcon()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT icon FROM association WHERE asso_id = ?", [this.asso_id]
        );
        return rows.icon;
    }

    // SETTERS
    async setName(name)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE association SET name = ? WHERE asso_id = ?`, [name, this.asso_id]);
    }

    async setDescription(description)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE association SET description = ? WHERE asso_id = ?`, [description, this.asso_id]);
    }

    async setIcon(icon)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE association SET icon = ? WHERE asso_id = ?`, [icon, this.asso_id]);
    }
}

module.exports = {Association};