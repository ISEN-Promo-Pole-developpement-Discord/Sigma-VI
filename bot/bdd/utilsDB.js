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

function updateTables(connection) {
    const sqlScript = fs.readFileSync("./bdd/createTables.sql").toString();

    console.log("Initialisation de la base de données MySQL...");
    connection.query(sqlScript, function(err, results) {
        if (err) throw err;
        console.log("Tables mises à jour.");
        if(global.debug){
            console.log("<Résultats de la requête>");
            console.log(results);
        }
    });
}

module.exports = {
    connection,
    initBdd() {
        console.log("Connexion...");
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connecté à la base de données MySQL.");
            updateTables(connection);
        });
    }
}