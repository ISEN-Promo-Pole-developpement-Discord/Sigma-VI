const mysql = require("mysql2");
const config = global.config;
const fs = require("node:fs");

/**
 * 
 * @param {mysql.PoolConnection} connection a mysql connection
 */
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

const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    multipleStatements: true
});

async function promiseQuery(query, values = null) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            if(values === null) {
                connection.query(query, (err, results) => {
                    connection.release();
                    if (err){
                        console.log(err);
                        reject(err);
                    } else resolve(results);
                });
            } else {
                connection.query(query, values, (err, results) => {
                    connection.release();
                    if (err){
                        console.log(err);
                        reject(err);
                    } else resolve(results);
                });
            }
        });
    });
}

module.exports = {
    pool,
    initBdd() {
        console.log("Connexion...");
        global.sqlConnection = promiseQuery;
        pool.getConnection(function(err, connection) {
            if(err) {
                console.log("Erreur de connexion à la base de données MySQL :\n");
                throw err;
            }
            console.log("Connecté à la base de données MySQL.");
            updateTables(connection);
        });
    }
}