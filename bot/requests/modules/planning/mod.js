const {Request} = require("../../requestClass");
const getMessageURLs = require("../../processors/getURLs");
const CORE = require("./core");

async function moduleProcess(request){
    request.notifyStart();
    console.log("[PLANNING REQUEST] "+request.message.author.tag+" : "+request.message.content);
    var urls = getMessageURLs(request.message.content);
    request.notifyEnd(await CORE(urls, request.createdAt().getTime()));
}

module.exports = moduleProcess;