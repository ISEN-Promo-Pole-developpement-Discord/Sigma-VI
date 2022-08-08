const mysql = require("mysql2");
const config = require("../config.json");
const fs = require("node:fs");
const util = require("util");

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    multipleStatements: true
});

const query = util.promisify(connection.query).bind(connection);

global.sqlConnection = query;

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