function getMentions(string){
    var mentions = [];
    var regex = /<@!?(\d+)>/gi;
    var matches = string.match(regex);
    if(matches !== null){
        for(var i = 0; i < matches.length; i++){
            mentions.push(matches[i]);
        }
    }
    return mentions;
}

module.exports = getMentions;