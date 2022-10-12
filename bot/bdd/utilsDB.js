const mysql = require("mysql2");
const config = global.config;
const fs = require("node:fs");
const { logStart, logEnd } = require("../utils/stdoutLogger.js");

/**
 * Try to initialize the database (create tables if they don't exist)
 * @param {mysql.PoolConnection} connection a mysql connection
 * @returns {Promise} a promise that resolves when the database is initialized
 */
async function updateTables(connection) {
    return new Promise((resolve, reject) => {
        const sqlScript = fs.readFileSync("./bdd/createTables.sql").toString();
        logStart("> Mise à jour de la base de données : ");
        connection.query(sqlScript, function(err, results) {
            if (err){
                logEnd(false);
                console.log(err);
                throw err;
            }
            logEnd(true);
            resolve();
        });
    });
}

/**
 * Bot pool connection
 * @type {mysql.Pool}
 */
const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    multipleStatements: true
});
/**
 * Promisified version of pool.query
 * @param {String} querry the querry to execute
 * @param {Array} values the values to insert in the querry
 * @returns {Promise} a promise that resolves with the result of the querry
 */
async function promiseQuery(query, values = null) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            var args = [query];
            if(values) args.push(values);
            connection.query(...args, function(err, results) {
                connection.release();
                if(err) {
                    console.log(err);
                    reject(err);
                }else resolve(results);
            });
        });
    });
}

/**
 * Initialize the database and pool connection
 */
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        logStart("> Connexion à la base de donnée : ");
        global.sqlConnection = promiseQuery;
        pool.getConnection(async function(err, connection) {
            if(err) {
                logEnd(false);
                console.log(err);
                throw err;
            }
            logEnd(true);
            await updateTables(connection);
            resolve();
        });
    });
}

module.exports = {
    pool,
    initializeDatabase
}