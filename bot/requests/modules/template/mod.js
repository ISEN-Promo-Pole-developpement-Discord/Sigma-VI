const {Request} = require("../../requestClass");

function moduleProcess(request){
    request.notifyStart();
    console.log("[TEMPLATE REQUEST] "+request.message.author.tag+" : "+request.message.content);
    request.notifyEnd("Requête traitée.\n> " + request.content + "\n> " + request.SRWF());
}

module.exports = moduleProcess;