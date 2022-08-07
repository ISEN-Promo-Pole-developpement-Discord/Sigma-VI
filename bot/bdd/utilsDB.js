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

global.sqlConnection = connection;

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

function userTableQuery(connection, typeOfRequest, insertTab, requestTab)
{
    if (typeOfRequest === 0)            // INSERT QUERY
        connection.query(`INSERT INTO user(user_id, name, surname, status, user_data) VALUES('${insertTab[0]}', '${insertTab[1]}', '${insertTab[2]}', '${insertTab[3]}', '${insertTab[4]}')`);
    // else if (typeOfRequest === 1)       // UPDATE QUERY

}

// TODO : Need to move out this function into UserManager Class
function userInfoGrabber(connection, userID)
{
    connection.query(`SELECT * FROM user WHERE user_id = '${userID}'`, function(err, results, fields)
    {
        if (err) throw(err);
        else
            console.log(results);
    });
}

module.exports = {
    connection,
    initBdd() {
        console.log("Connexion à la base de données MySQL...");
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connecté à la base de données MySQL.");
            updateTables(connection);
        });
    }
}