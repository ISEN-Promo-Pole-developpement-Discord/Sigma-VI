function getMessageURLs(string){
    var urls = [];
    var regex = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}/gi;
    var matches = string.match(regex);
    if(matches !== null){
        for(var i = 0; i < matches.length; i++){
            urls.push(matches[i]);
        }
    }
    return urls;
}

module.exports = getMessageURLs;