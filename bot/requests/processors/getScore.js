const {getListOfModules, getModuleKeys} = require('../modules/modulesManager.js');


function getPerModuleScores (string) {
    var scores = {};
    var modules = getListOfModules();
    console.log(modules);
    for(var module of modules){
        var keys = getModuleKeys(module);
        console.log(keys);
        if(keys !== null){
            for(var key in keys){
                if(string.includes(key)){
                    if(!scores[module]) scores[module] = 0;
                    scores[module]+=(keys[key]);
                }
            }
        }
    }
    return scores;
}