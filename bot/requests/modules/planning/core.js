const {UsersManager} = require("../../../bdd/classes/usersManager");
const nodeIcal = require('node-ical');
const ping = require('ping');
const {includedSimilarity} = require("../../processors/stringIncludeSimilarity");
const Discord = require("discord.js");

async function coreProcess(author, dates = [], search = null, target = null){
    
    //Fetch target URL
    if(target == null) target = author;
    var icalURL= null;
    if(typeof target === "string"){
        if(target.includes("ent-toulon.isen.fr"))
            icalURL = target;
        else icalURL = `https://ent-toulon.isen.fr/webaurion/ICS/${target}.ics`;
    }else{
        targetBddUser = await UsersManager.getUser(target.id);
        if(targetBddUser == null){
            if(target.id == author.id) return "Une erreur s'est produite lors de votre identification. Veuillez réessayer.";
            else return "La cible demandé n'existe pas dans la base de données.";
        }
        icalURL = targetBddUser.getIcalURL();
    }
    
    //Fetch events from URL
    var events = null;
    try{
        events = await getEventsFromURL(icalURL);
    }catch(err){
        //ping ent-toulon.isen.fr
        var pingResult = await ping.promise.probe('ent-toulon.isen.fr');
        if(pingResult.alive) return "Une erreur s'est produite lors de l'accès à l'emplois du temps. Veuillez réessayer.";
        else return "Le serveur ent-toulon.isen.fr est actuellement hors-ligne.";
    }

    //Fetch events from dates
    var eventsFromDates = getICALEventsFromDate(dates, events);
    //Fetch events from searchs
    var eventFromSearch = search ? getICALEventFromSearch(search, events) : null;

    //Build reply
    var embed = new Discord.EmbedBuilder();
    embed.setColor(0xCC5500);
    
    if(search != null){
        if(eventFromSearch != null){
            console.log(`${renderEvent(eventFromSearch)}`);
            embed.setTitle(`Événement trouvé`);
            embed.setDescription(`${renderEvent(eventFromSearch)}`);
            embed.setTimestamp(eventFromSearch.start);
        } else {
            return "Aucun événement ne correspond à votre recherche.";
        }
    } else if(eventsFromDates.length == 1){
        console.log(`${renderDay(eventsFromDates[0])}`);
        embed.setTitle(`Événements du ${eventsFromDates[0].date}`);
        embed.setDescription(`${renderDay(eventsFromDates[0])}`);
    } else {
        console.log(`${renderEvents(eventsFromDates)}`);
        embed.setTitle(`Événements`);
        embed.setDescription(`${renderEvents(eventsFromDates)}`);
    }

    return {embeds: [embed]};
}

function renderEvents(eventsFromDates){
    var eventsString = "";
    for(var eventsFromDate of eventsFromDates){
        eventsString += renderDay(eventsFromDate);
        eventsString += "\n";
    }
    return eventsString;
}

function renderDay(eventsFromDate){
    var prefix = "";
    var dayString = `${prefix} **${formatDayToString(eventsFromDate.date)}**\n`;
    //render events
    if(eventsFromDate.events.length == 0){
        dayString += `${prefix} *Aucun événement*\n`;
    }else{   
        for(var event of eventsFromDate.events){
            dayString += renderEvent(event, prefix);
            dayString += "\n";
        }
    }
    return dayString;
}

function formatDayToString(date){
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var weekday = date.getDay();
    var weekdayString = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][weekday];
    var monthString = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][month];
    var dateString = `${weekdayString} ${day} ${monthString}`;
    if(year != new Date().getFullYear()) dateString += ` ${year}`;
    return dateString;
}

function renderEvent(event, tabulation = ""){
    eventStartHourFormat = `${event.start.getHours()}:${event.start.getMinutes()}`;
    eventEndHourFormat = `${event.end.getHours()}:${event.end.getMinutes()}`;
    var eventString = "";
    eventString += `${tabulation}▐ *${eventStartHourFormat} - ${eventEndHourFormat}*\n`;
    eventString += `${tabulation}▐ **${event.summary}**\n`;
    return eventString;
}

async function getEventsFromURL(URL){
    eventsPromise = new Promise((resolve, reject) => {
        try{
            nodeIcal.fromURL(URL, {}, function(err, data) {
                if(err) reject(err);
                else resolve(data);
            });
        }catch(err){
            reject(err);
        }
    });
    return eventsPromise;
}

function getICALEventsFromDate(dates, events){
    var eventsFromDates = [];
    for(var date of dates){
        var dateEvents = [];
        for(const [id, event] of Object.entries(events)){
            if(event.type != "VEVENT") continue;
            if(event.start.getTime() >= date.getTime() && event.end.getTime() <= (date.getTime() + 86400000)){
                dateEvents.push(event);
            }
        }
        eventsFromDates.push({date:date, events:dateEvents});
    }
    return eventsFromDates;
}

function getICALEventFromSearch(search, events){
    var searchWords = search.split(" ");
    var eventsScores = {};
    var eventFromSearch = null;
    var todayTime = new Date().getTime();
    if(searchWords.length == 0) return null;

    if(searchWords.length == 1 && searchWords[0] == "next"){
        var minDeltaTimeFromNow = Infinity;
        for(const [id, event] of Object.entries(events)){
            if(event.type != "VEVENT") continue;
            var deltaTimeFromNow = event.start.getTime() - todayTime;
            if(deltaTimeFromNow < minDeltaTimeFromNow && deltaTimeFromNow > 0){
                minDeltaTimeFromNow = deltaTimeFromNow;
                eventFromSearch = event;
            }
        }
        return eventFromSearch;
    }

    for(const [id, event] of Object.entries(events)){
        if(event.type != "VEVENT") continue;
        if((event.start.getTime() + event.end.getTime()) / 2 <= todayTime) continue;
        var score = 0;
        for(var searchWord of searchWords){
            var includedWordSimilarity = includedSimilarity(eventWords.join(event.summary + " " + event.description), searchWord);
            score += includedWordSimilarity < 0.5 ? 0 : includedWordSimilarity;
        }
        deltaTimeFromNow = Math.abs(event.start.getTime() - todayTime) + 0.1;
        eventsScores[id] = {event:event, score:score * Math.sqrt(1.0 / (deltaTimeFromNow))};
    }
    var maxScore = 0;
    for(const [id, eventContent] in eventsScores){
        if(eventsScores[id].score > maxScore){
            maxScore = eventsScores[id].score;
            eventFromSearch = eventsScores[id].event;
        }
    }
    return eventFromSearch;
}

module.exports = coreProcess; 