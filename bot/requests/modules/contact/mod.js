const CORE = require("./core");

async function moduleProcess(request){
    request.notifyStart();
    console.log("[CONTACT REQUEST] " + request.message.author.tag + " : "+request.content);
    request.notifyEnd(await CORE(request.content));
}

module.exports = moduleProcess;