const { includedSimilarity } = require("./stringIncludeSimilarity");

const wordsBlackList = [
    "elec", "omi", "math", "maths", "shes"
]

function getFormatedNameFromString(name, namesList){
    if(!name) return null;
    if(!namesList) return null;
    if(!Array.isArray(namesList)) return null;
    if(namesList.length == 0) return null;
    var nameNorm = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\-\.]/g, " ");
    if(wordsBlackList.includes(nameNorm)) return null;
    var scoreNameMap = {};
    for(var nameInList of namesList){
        //normalize name
        var nameInListNorm = nameInList.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\-\.]/g, " ");
        var nameElementsScore = includedSimilarity(nameInListNorm, nameNorm, 0.5, 0.6, 1);
        scoreNameMap[nameInList] = {score: nameElementsScore, name: nameInList};
    }
    var maxScore = 0;
    var maxScoreName = "";
    for(const [name, scoreName] of Object.entries(scoreNameMap)){
        if(scoreName.score > maxScore){
            maxScore = scoreName.score;
            maxScoreName = scoreName.name;
        }
    }
    if(maxScore > 0.5) return maxScoreName;
    else return null;
}

module.exports = { getFormatedNameFromString };