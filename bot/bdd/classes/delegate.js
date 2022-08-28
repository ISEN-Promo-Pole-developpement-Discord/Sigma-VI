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
        return rows[0].class;
    }

    async setClass(class)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE delegates SET class = ? WHERE user_id = ?`, [class, this.user_id]);
    }
}

module.exports = {Delegate};