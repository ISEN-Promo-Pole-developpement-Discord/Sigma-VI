const {includedSimilarity} = require("./stringIncludeSimilarity.js");

const aliases = {
    'AMPHI': ['amphi', 'amphitheatre'],
    '000_HALL' : ['hall', 'hallway', 'zero', 'entree'],
    '001_COWORK' : ['cowork', 'coworking', 'foyer'],
    '002_FABLAB' : ['fablab', 'cofab', 'co-fab'],
    215 : ['labo si', 'labo science de l\'ingenieur'],
    317 : ['labo telecom', 'labo telecoms', 'labo telecomunication'],
    359 : ['labo micro', 'labo microelectronique', 'labo microelectroniques'],
    407 : ['labo chimie'],
    459 : ['ici', 'ici lab', 'icilab'],
    'CHALUCET_305' : ['chalucet 305'],
    'CHALUCET_306' : ['chalucet 306'],
    'CHALUCET_307' : ['chalucet 307'],
    'CHALUCET_308' : ['chalucet 308']
};


function getTargetPlace(string){
    var regexThreeNumber = /[0-9]{3}/g;
    bestAlias = null;
    bestAliasSimilarity = 0;
    for(var alias in aliases){
        for(var i = 0; i < aliases[alias].length; i++){
            var similarity = includedSimilarity(string, aliases[alias][i]);
            if(similarity > bestAliasSimilarity){
                bestAliasSimilarity = similarity;
                bestAlias = alias;
            }
        }
    }
    if(bestAliasSimilarity > 0.5)
        return bestAlias;
    
    var matches = string.match(regexThreeNumber);
    if(matches !== null)
        return matches[0];
    return null;
}

module.exports = getTargetPlace;