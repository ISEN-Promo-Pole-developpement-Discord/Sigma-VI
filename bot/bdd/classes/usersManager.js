const {User} = require('./user.js');

/**
 * UsersManager class
 * @class
 * @static
 */
class UsersManager
{
    /**
     * Get a user from its ID
     * @param {string|number} id The user's ID 
     * @returns  {Promise<User>} The user
     * @static
     * @async
     */
    static async getUser(id)
    {
        if (typeof id !== "string" && typeof id !== "number")
            throw new TypeError("id must be a string or a number");
        const connection = global.sqlConnection;
        const query = "SELECT * FROM user WHERE user_id = ?";
        const data = await connection(query, id);
        if (data.length === 0) return null;
        else
            return new User(id);
    }

    /**
     * Get all users
     * @returns {Promise<Array<User>>} The users
     * @static
     * @async
     */
    static async getUsers()
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM user";
        const data = await connection(query);
        if (data.length === 0) return [];
        else
            return data.map(user => new User(user.user_id));
    }

    /**
     * Search for a user
     * @param {Array<string>} args The arguments to search for
     * @returns {Promise<Array<User>>} The users found
     * @static
     * @async
     * @deprecated
     */
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

    /**
     * Add a user to the database
     * @param {User} user The user to add
     * @returns {Promise<User>} The user
     * @static
     * @async
     * @todo switch to user_id
     */
    static async addUser(user)
    {
        if (!(user instanceof User) && !user.id)
            throw new TypeError("user must be an instance of User");
        if (await this.getUser(user.id) !== null) return;
        const connection = global.sqlConnection;
        const query = "INSERT INTO user (user_id, name, surname, email, password, status, user_data) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [user.id, user.name, user.surname, user.email, user.password, user.status, user.data];
        await connection(query, values);
        return new User(user.id);
    }

    /**
     * Remove a user from the database
     * @param {string|number} id The user's ID
     * @static
     * @async
     * @returns {Promise<void>}
     */
    static async deleteUser(id)
    {
        if (await this.getUser(id) === null) return;
        const connection = global.sqlConnection;
        const query = "DELETE FROM user WHERE user_id = ?";
        await connection(query, id);
    }
}

global.usersManager = UsersManager;
module.exports = {UsersManager};