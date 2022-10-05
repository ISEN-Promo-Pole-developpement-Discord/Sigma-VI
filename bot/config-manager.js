const path = require('path');
const fs = require('fs');

const configTemplate = [
    {
        "token": "Your bot token here",
        "mysql": {
            "host": "localhost",
            "user": "root",
            "database": "sigma",
            "password": ""
        },
        "mail": {
            "host": "smtp.gmail.com",
            "port": "465",
            "secure": true,
            "auth": {
                "user": "",
                "pass": ""
            }
        }
    }
]


function getConfig() {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config) {
            if(configTemplate.token == config.token){
                throw new Error("You must set the token in the config file (config.json)");
            }
            return config;
        }
    }
    else {
        fs.writeFileSync(configPath, JSON.stringify(configTemplate, null, 4));
        throw new Error("Please configure the bot before running it.");
    }
    return null;
}

function getConfigCore(){
    const configPath = path.join(__dirname, 'config-core.json');
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return null;
}

module.exports = {
    getConfig,
    getConfigCore
}