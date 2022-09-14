const { includedSimilarity } = require("./stringIncludeSimilarity");

function getFormatedNameFromString(name, namesList){
    var scoreNameMap = {};
    var nameNorm = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\-\.]/g, " ");
    for(var nameInList of namesList){
        //normalize name
        var nameInListNorm = nameInList.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\-\.]/g, " ");
        var nameElementsScore = includedSimilarity(nameInListNorm, nameNorm, 0.4, 0.6);
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