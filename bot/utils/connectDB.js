const mysql = require("mysql2");
const config = require("../config.json");

module.exports = {
    connection: mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password
    })
}