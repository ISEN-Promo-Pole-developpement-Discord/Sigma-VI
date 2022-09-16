const {Request} = require("../../requestClass");

function moduleProcess(request){
    request.notifyStart();
    console.log("[METEO REQUEST] "+request.message.author.tag+" : "+request.message.content);
    request.notifyEnd("Le module météo n'est pas encore actif.");
}

module.exports = moduleProcess;