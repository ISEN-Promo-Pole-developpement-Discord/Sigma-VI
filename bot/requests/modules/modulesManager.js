const fs = require('fs');
const path = require("path");

const modulesPath = path.join(__dirname);

function getListOfModules(){
    // Get list of folder in modules folder
    var modules = fs.readdirSync(modulesPath);
    modules = modules.filter(function(file) {
        if(file === "modulesManager.js") return false;
        return fs.statSync(modulesPath + '/' + file).isDirectory();
    });
    return modules;
}

function getModuleKeys(moduleName){
    keysPath = modulesPath + '/' + moduleName + '/#keys.json';
    if(fs.existsSync(keysPath)) return require(keysPath);
    return null;
}

function getModuleTests(moduleName){
    testsPath = modulesPath + '/' + moduleName + '/#tests.json';
    if(fs.existsSync(testsPath)) return require(testsPath);
    return null;
}


module.exports = {
    getListOfModules,
    getModuleKeys,
    getModuleTests
}