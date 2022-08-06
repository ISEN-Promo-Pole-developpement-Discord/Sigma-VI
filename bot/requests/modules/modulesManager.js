const fs = require('fs');
const path = require("path");

const modulesPath = path.join(__dirname);

function getModulePath(moduleName){
    return modulesPath + '/' + moduleName;
}

async function submitRequestToModule(request, module){
    moduleProcessPath = getModulePath(module) + '/mod.js';
    console.log(moduleProcessPath);
    if(fs.existsSync(moduleProcessPath)){
        var moduleProcess = require(moduleProcessPath);
        console.log("[MODULE] "+module+" : "+request.content);
        if(typeof moduleProcess === "function")
        moduleProcess(request);
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


module.exports = {
    getListOfModules,
    getModuleKeys,
    getModuleTests,
    submitRequestToModule,
    getModulePath
}