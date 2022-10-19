const Discord = require("discord.js");
const laposte = require("./laposte_hexasmal.json");
const { AttachmentBuilder} = require('discord.js');
const https = require('https');


/* Function getPostalCodewithname 
 * description plus tard
 * @param name , name of the city
 * return the postal code who correspond with the name of the city or 00000 if the name dosn't exist in the json
 */
function getPostalCodewithname(name){
    let postalCode=00000;
    if(name){   
        laposte.forEach(entry => {
            if(entry.libelle_d_acheminement === name.toUpperCase()){
                postalCode=entry.code_commune_insee;
            }
        });
    }
    return postalCode;
}


//exemple de requete api : curl 'https://api.sncf.com/v1/coverage/sncf/journeys?from=admin:fr:83137&to=admin:fr:13001&da83000e=20221011T133315' -H 'Authorization: a6b6d0c8-1fcc-4948-aa69-24bc5468da8d'


