class Delegate
{
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getClass()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT class FROM delegates WHERE user_id = ?", [this.user_id]
        );
        return rows.class;
    }

    async setClass(class_name)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE delegates SET class = ? WHERE user_id = ?`, [class_name, this.user_id]);
    }
}

module.exports = {Delegate};