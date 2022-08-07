class User
{
    constructor(id) {
        this.id = id;
    }

    // GETTERS
    async getName()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection.execute(
            "SELECT name FROM user WHERE id = ?", [this.id]
        );
        return rows[0].name;
    }

    async getSurname()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection.execute(
            "SELECT surname FROM user WHERE id = ?", [this.id]
        );
        return rows[0].surname;
    }

    async getEmail()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection.execute(
            "SELECT email FROM user WHERE id = ?", [this.id]
        );
        return rows[0].email;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection.execute(
            "SELECT email FROM user WHERE id = ?", [this.id]
        );
        return rows[0].status;
    }

    async getData()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection.execute(
            "SELECT email FROM user WHERE id = ?", [this.id]
        );
        return rows[0].user_data;
    }

    // SETTERS
    setName(name)
    {
        const connection = global.sqlConnection;
        connection.query(`UPDATE user SET name = ? WHERE user_id = ?`, name, [this.id]);
    }

    setSurname(surname)
    {
        const connection = global.sqlConnection;
        connection.query(`UPDATE user SET surname = ? WHERE user_id = ?`, surname, [this.id]);
    }

    setEmail(email)
    {
        const connection = global.sqlConnection;
        connection.query(`UPDATE user SET email = ? WHERE user_id = ?`, email, [this.id]);
    }

    setStatus(status)
    {
        const connection = global.sqlConnection;
        connection.query(`UPDATE user SET status = ? WHERE user_id = ?`, status, [this.id]);
    }

    setData(data)
    {
        const connection = global.sqlConnection;
        connection.query(`UPDATE user SET user_data = ? WHERE user_id = ?`, data, [this.id]);
    }
}

module.exports = {User};