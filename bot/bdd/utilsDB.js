const mysql = require("mysql2");
const config = require("../config.json");
const fs = require("node:fs");

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

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    multipleStatements: true
});

async function promiseQuery(query, values = null) {
    return new Promise((resolve, reject) => {
        if(values === null) {
            connection.query(query, (err, results) => {
                if (err){
                    console.log(err);
                    reject(err);
                } else resolve(results);
            });
        } else {
            connection.query(query, values, (err, results) => {
                if (err){
                    console.log(err);
                    reject(err);
                } else resolve(results);
            });
        }
    });
}

module.exports = {
    connection,
    initBdd() {
        console.log("Connexion...");
        global.sqlConnection = promiseQuery;

        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connecté à la base de données MySQL.");
            updateTables(connection);
        });
    }
}