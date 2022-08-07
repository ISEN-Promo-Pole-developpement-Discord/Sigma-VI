const {User} = require('./user.js');

class UsersManager
{
    async getUser(id)
    {
        // PROBLEM WITH await AND promise
        const connexion = global.sqlConnection;
        const query = "SELECT * FROM user WHERE user_id = ?";
        const data = await connexion.query(query, id);
        if (data === null || data === undefined) return null;
        else
            return new User(id);
    }

    // TODO : Make this function compatible with user_data
    searchUsers(flags)
    {
        let flag = 0;
        const connection = global.sqlConnection;
        let query = "SELECT user_id FROM user WHERE";

        // QUERY COMPLETION
        flags.forEach((value, index) => {
            if (flag) query += " AND";
            else flag = 1;
            query += ` ${index} = '${value}'`;
        });

        // TODO : Need to return an array of user objects
        // This function's query will collect all users id
        // Then, forEach loop which will generate user Object via ID by getUser() and stock it into an array ??
    }

    static addUser(user)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO user (user_id, name, surname, email, password, status, user_data) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [user.id, user.name, user.surname, user.email, user.password, -1, "{}"];
        connection.query(query, values);        // NO await HERE BECAUSE SAME PROBLEM AS getUser()

        // const [createdUser] = await connection.query("SELECT LAST_INSERT_ID() as id");
        // return new User(createdUser[0].id);
    }
}

module.exports = {UsersManager};