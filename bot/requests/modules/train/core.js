const Discord = require("discord.js");
const { AttachmentBuilder} = require('discord.js');
const urlPostalCode='https://vicopo.selfbuild.fr/cherche'
const https = require('https'); 
const Private=require('./key.json');


/* Function getPostalCodewithname 
 * description plus tard
 * @param name , name of the city
 * return the postal code who correspond with the name of the city or false if the name dosn't exist in the json
 */
async function getPostalCodeWithName(name){
    if(typeof name === "string"){
        https.get(`${urlPostalCode}/${name}`,function(result){
            result.on('data',function(data){
                datajson=JSON.parse(data.toString());
                datajson.cities.forEach(entry => {
                    if(entry.city.toLowerCase() == name.toLowerCase()){
                        console.log(entry.code);
                        return entry.code;
                    }
                })
            return false;
            }).on('error',function(e){
                console.log(`Eroor ${e.message}`);
                return 'error'
            })
        });
    }
}

//getPostalCodeWithName('Toulon');

//curl `https://api.sncf.com/v1/coverage/sncf/journeys?from=admin:fr:${PosCodeVilleDepart}&to=admin:fr:${PosCodeVilleArrive}&datetime=${date}T133315' -H `${Private}`
