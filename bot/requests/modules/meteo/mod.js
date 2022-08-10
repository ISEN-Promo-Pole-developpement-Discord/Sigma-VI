const {Request} = require("../../requestClass");

function moduleProcess(request){
    request.notifyStart();
    console.log("[PLANNING REQUEST] "+request.message.author.tag+" : "+request.message.content);
    request.notifyEnd("Requête de planning traitée.\n> " + request.content + "\n> " + request.SRWF());
}

module.exports = moduleProcess;