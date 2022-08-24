const {User} = require('./user.js');

class UsersManager
{
    static async getUser(id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM user WHERE user_id = ?";
        const data = await connection(query, id);
        if (data.length === 0) return null;
        else
            return new User(id);
    }

    static async searchUsers(args)
    {
        let flag = 0;
        const connection = global.sqlConnection;
        let query = "SELECT user_id FROM user WHERE";

        Object.entries(args).forEach(entry => {
            const [key, value] = entry;

            if (flag) query += " AND";
            else flag = 1;

            query += ` ${key} = '${value}'`;
        });

        // This query will collect all users' id
        const data = await connection(query);

        // forEach loop which will generate user Object via ID by getUser() and stock it into an array
        if (data.length === 0) return null;
        else
        {
            let userArray = [];
            for (const value of data) {
                userArray.push(await UsersManager.getUser(value.user_id));
            }
            return userArray;
        }
    }

    static async addUser(user)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO user (user_id, name, surname, email, password, status, user_data) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [user.id, user.name, user.surname, user.email, user.password, user.status, user.data];
        await connection(query, values);
        return new User(user.id);
    }
}

module.exports = {UsersManager};