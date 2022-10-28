const {getListOfModules, getModuleKeys} = require('../modules/modulesManager.js');
const {includedSimilarity} = require('./stringIncludeSimilarity.js');

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
    if(maxScore < 10) return null;
    return module;
}

function getPerModuleScores(string) {
    var scores = {};
    var modules = getListOfModules();
    for(var module of modules){
        var keys = getModuleKeys(module);
        if(keys !== null){
            for(var key in keys){
                var similarity = includedSimilarity(string, key);
                if(similarity > 0.67){
                    if(!scores[module]) scores[module] = 0;
                    scores[module]+=(keys[key] * similarity);
                }
            }
        }
    }
    return scores;
}

module.exports = {getPerModuleScores, getBestStringModule};