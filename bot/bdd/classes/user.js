class User
{
    constructor(id) {
        this.id = id;
    }

    // GETTERS
    async getName()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT name FROM user WHERE id = ?", [this.id]
        );
        return rows[0].name;
    }

    async getSurname()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT surname FROM user WHERE id = ?", [this.id]
        );
        return rows[0].surname;
    }

    async getEmail()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT email FROM user WHERE id = ?", [this.id]
        );
        return rows[0].email;
    }
    
    async getIcalURL(){
        const formatedName = userData.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(" ","-");
        const formatedSurname = userData.surname.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(" ","-");
        const URL = `https://ent-toulon.isen.fr/webaurion/ICS/${formatedName}.${formatedSurname}.ics`;
        return url;
    }

    async getPassword()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT password FROM user WHERE id = ?", [this.id]
        );
        return rows[0].password;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT email FROM user WHERE id = ?", [this.id]
        );
        return rows[0].status;
    }

    async getData()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT email FROM user WHERE id = ?", [this.id]
        );
        return rows[0].user_data;
    }

    // SETTERS
    async setName(name)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET name = ? WHERE user_id = ?`, [name, this.id]);
    }

    async setSurname(surname)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET surname = ? WHERE user_id = ?`, [surname, this.id]);
    }

    async setEmail(email)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET email = ? WHERE user_id = ?`, [email, this.id]);
    }

    async setPassword(password)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET password = ? WHERE user_id = ?`, [password, this.id]);
    }

    async setStatus(status)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET status = ? WHERE user_id = ?`, [status, this.id]);
    }

    async setData(data)
    {
        const connection = global.sqlConnection;
        await connection(`UPDATE user SET user_data = ? WHERE user_id = ?`, [data, this.id]);
    }
}

module.exports = {User};