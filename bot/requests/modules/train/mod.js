const {Request} = require("../../requestClass");
const CORE = require("./core");
const keys = require("./#keys.json");

function moduleProcess(request){
    request.notifyStart();
    console.log("[TRAIN REQUEST] "+request.message.author.tag+" : "+request.message.content);
    request.notifyEnd("Le module train n'est pas encore actif.");
}

module.exports = moduleProcess;