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


function getModuleConfig(moduleName){
    configPath = getModulePath(moduleName) + '/#config.json';
    if(fs.existsSync(configPath)) return require(configPath);
    return null;
}

async function loadModulesCommands(guildId = null){
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord.js');
    var modules = getListOfModules();
    var commands = [];

    for(var module of modules){
        var moduleCommand = await loadModuleCommand(module);
        if(moduleCommand !== undefined){
            const moduleConfig = getModuleConfig(module);
            if(moduleConfig){
                if(moduleConfig.isMainGuildOnly){
                    if(guildId && guildId !== global.config.core.mainGuildId){
                        continue;
                    }
                }
            }
            commands.push(moduleCommand.data.toJSON());
        }
    }
    const rest = new REST({version: '10'}).setToken(global.config.token);
    return new Promise((resolve, reject) => {
        if(guildId){
            rest.put(Routes.applicationGuildCommands(global.client.user.id, guildId), { body: commands })
            .then(() => resolve())
            .catch(console.error);
        }else{
            rest.put(Routes.applicationCommands(global.client.user.id), { body: commands })
            .then(() => resolve())
            .catch(console.error);
        }
    });
}

async function loadModuleCommand(moduleName){
    commandPath = getModulePath(moduleName) + '/command.js';
    if(fs.existsSync(commandPath)){
        var command = require(commandPath);
        command.data = await command.data;
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