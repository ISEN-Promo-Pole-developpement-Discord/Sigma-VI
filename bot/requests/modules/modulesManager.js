const fs = require('fs');
const path = require("path");
const { Collection } = require('discord.js');

const modulesPath = path.join(__dirname);

function getModulePath(moduleName){
    return modulesPath + '/' + moduleName;
}

async function submitRequestToModule(request, module){
    moduleProcessPath = getModulePath(module) + '/mod.js';
    if(fs.existsSync(moduleProcessPath)){
        var moduleProcess = require(moduleProcessPath);
        console.log("[MODULE] "+module+" : "+request.content);
        if(typeof moduleProcess === "function"){
            try{
                moduleProcess(request);
            }catch(err){
                console.log(err);
                request.notifyEnd(`Une erreur est survenue. (module "${module.toUpperCase()}")\n`);
            }
        }
    }
}

function getListOfModules(){
    // Get list of folder in modules folder
    var modules = fs.readdirSync(modulesPath);
    modules = modules.filter(function(file) {
        if(file === "modulesManager.js" || file === "template") return false;
        return fs.statSync(getModulePath(file)).isDirectory();
    });
    return modules;
}

function getModuleKeys(moduleName){
    keysPath = getModulePath(moduleName) + '/#keys.json';
    if(fs.existsSync(keysPath)){
        var defaultKeys = require(keysPath);
        var normalizedKeys = {};
        for(var key in defaultKeys){
            normalizedKeys[key.toLowerCase().trim().normalize("NFD").replace(/\p{Diacritic}/gu, "")] = defaultKeys[key];
        }
        return normalizedKeys;
    }
    return null;
}

function getModuleTests(moduleName){
    testsPath = getModulePath(moduleName) + '/#tests.json';
    if(fs.existsSync(testsPath)) return require(testsPath);
    return null;
}
 function loadModulesCommands(guildId){
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord.js');
    var modules = getListOfModules();
    var commands = [];
    for(var module of modules){
        var moduleCommand = loadModuleCommand(module);
        if(moduleCommand !== undefined) commands.push(moduleCommand.data.toJSON());
    }
    const rest = new REST({version: '10'}).setToken(global.config.token);
    rest.put(Routes.applicationGuildCommands(global.client.user.id, guildId), { body: commands })
	.then(() => console.log('Successfully registered modules application commands for server ' + guildId))
	.catch(console.error);
}

function loadModuleCommand(moduleName){
    commandPath = getModulePath(moduleName) + '/command.json';
    if(fs.existsSync(commandPath)){
        const command = require(commandPath);
        global.client.commands.set(command.data.name, command);
        return command;
    }
}

module.exports = {
    getListOfModules,
    getModuleKeys,
    getModuleTests,
    submitRequestToModule,
    getModulePath,
    loadModulesCommands
}