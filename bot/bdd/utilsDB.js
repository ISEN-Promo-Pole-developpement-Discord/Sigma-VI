const mysql = require("mysql2");
const config = require("../config.json");
const fs = require("node:fs")

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    multipleStatements: true
});

function testConnection(connection) {
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connecté à la base de données MySQL.");
    });
}

function createTables(connection) {
    const sqlScript = fs.readFileSync("./bdd/createTables.sql").toString();

    connection.query(sqlScript, function(err, results) {
        if (err) throw err;
        
        for (let i=0; i<results.length; i++) {
            console.log(results[i]);
        }
    });
}

module.exports = {
    connection,
    initBdd() {
        const con = connection;
        testConnection(con);
        createTables(con);
    }
}