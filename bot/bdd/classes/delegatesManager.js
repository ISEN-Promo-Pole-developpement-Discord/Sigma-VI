const {Delegate} = require('./delegate');

class DelegatesManager
{
    static async getDelegate(id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM delegates WHERE user_id = ?";
        const data = await connection(query, id);
        if (data.length === 0) return null;
        else
            return new Delegate(id);
    }

    static async addDelegate(delegate)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO delegates (user_id, class) VALUES (?, ?)";
        const values = [delegate.user_id, delegate.class];
        await connection(query, values);
        return new Delegate(delegate.user_id);
    }

    static async deleteDelegate(id)
    {
        const connection = global.sqlConnection;
        await connection(`DELETE FROM delegates WHERE user_id = ?`, id);
    }
}

module.exports = {DelegatesManager};