const {Request} = require("../../requestClass");
const CORE = require("./core");

async function moduleProcess(request){
    request.notifyStart();
    console.log("[PING REQUEST] "+request.message.author.tag+" : "+request.message.content);
    var urls = getMessageURLs(request.message.content);
    request.notifyEnd(await CORE(urls, request.createdAt().getTime()));
}

function getMessageURLs(string){
    var urls = [];
    var regex = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}/gi;
    var matches = string.match(regex);
    if(matches !== null){
        for(var i = 0; i < matches.length; i++){
            urls.push(matches[i]);
        }
    }else return null;
    return urls;
}

module.exports = moduleProcess;