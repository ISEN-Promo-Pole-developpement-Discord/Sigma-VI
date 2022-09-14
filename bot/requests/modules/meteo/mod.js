const {Request} = require("../../requestClass");

function moduleProcess(request){
    request.notifyStart();
    console.log("[METEO REQUEST] "+request.message.author.tag+" : "+request.message.content);
    request.notifyEnd("Le module météo n'est pas encore actif.\n> " + request.content + "\n> " + request.SRWF());
}

module.exports = moduleProcess;