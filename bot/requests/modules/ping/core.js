const Discord = require("discord.js");
const ping = require('ping');
const config = require('./#config.json');

async function coreProcess(url = [], requestCall = new Date()){
    if(typeof requestCall === "date") requestCall = requestCall.getTime();
    if(!url.length) url = config.services;
    if(typeof url === "string") url = [url];
    var results = [];
    for(var service of url){
        var result = null;
        if(service === "Sigma"){
            var timeInMs = new Date().getTime() - requestCall;
            result = {alive: true, inputHost: "Sigma", packetLoss: "0", time:timeInMs};
        }else{
            result = await pingUrl(service);
        }
        results.push(result);
    }
    var embed = new Discord.EmbedBuilder();
    if(url.length === 1)
        embed.setTitle(`Statut de "${url[0]}"`);
    else embed.setTitle("Statut des services");
    var description = "";
    for(var result of results){
        if(result.inputHost === "Sigma"){
            description += `${getIcon(result.time/10)} **${result.inputHost}** - ${result.time}ms\n`;
        }else if(result.alive){
            description += `${getIcon(result.time)} **${result.inputHost}** - ${result.time}ms\n`;
        }else{
            description += `${getIcon(-1)} **${result.inputHost}** - ***DOWN***\n`;
        }
    }
    embed.setDescription(description).setTimestamp();
    embed.setColor(0x202020);
    var content = {embeds:[embed]};
    return content;
}

async function pingUrl(url){
    result = await ping.promise.probe(url, {
        timeout: 100
    });
    return result;
}

function getIcon(time){
    var icons = config.icons;
    var i = "";
    var delta = NaN;
    for(icon in icons){
        if(time < 0 && icons[icon] < 0)
            return icon;
        if(time > icons[icon]){
            newDelta = time - icons[icon];
            if(isNaN(delta) || newDelta < delta) {
                delta = newDelta;
                i = icon;
            }
        }
    }
    return i;
}

module.exports = coreProcess;