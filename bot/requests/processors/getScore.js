const {getListOfModules, getModuleKeys} = require('../modules/modulesManager.js');

function getBestStringModule(string){
    var scores = getPerModuleScores(string);
    var module = null;
    var maxScore = 0;
    for(var score in scores){
        if(scores[score] > maxScore){
            maxScore = scores[score];
            module = score;
        }
    }
    return module;
}

function getPerModuleScores(string) {
    var scores = {};
    var modules = getListOfModules();
    for(var module of modules){
        var keys = getModuleKeys(module);
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

module.exports = {getPerModuleScores, getBestStringModule};