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
            "SELECT name FROM user WHERE user_id = ?", [this.id]
        );
        return rows.name;
    }

    async getSurname()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT surname FROM user WHERE user_id = ?", [this.id]
        );
        return rows.surname;
    }

    async getEmail()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT email FROM user WHERE user_id = ?", [this.id]
        );
        return rows.email;
    }
    
    async getIcalURL(){
        const name = await this.getName();
        const surname = await this.getSurname();
        if(name != null && surname != null){
            const formatedName = name.toLowerCase().normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").replaceAll(" ","-");
            const formatedSurname = surname.toLowerCase().normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").replaceAll(" ","-");
            const URL = `https://ent-toulon.isen.fr/webaurion/ICS/${formatedName}.${formatedSurname}.ics`;
            return URL;
        }
        return null;
    }

    async getPassword()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT password FROM user WHERE user_id = ?", [this.id]
        );
        return rows.password;
    }

    async getStatus()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT status FROM user WHERE user_id = ?", [this.id]
        );
        return rows.status;
    }

    async getData()
    {
        const connection = global.sqlConnection;
        const [rows] = await connection(
            "SELECT user_data FROM user WHERE user_id = ?", [this.id]
        );
        if(rows.user_data != null){
            if(typeof rows.user_data === "string"){
                return JSON.parse(rows.user_data);
            }
            else{
                return rows.user_data;
            }
        }
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
        const dataJSON = JSON.stringify(data);
        await connection(`UPDATE user SET user_data = ? WHERE user_id = ?`, [dataJSON, this.id]);
    }
}

module.exports = {User};