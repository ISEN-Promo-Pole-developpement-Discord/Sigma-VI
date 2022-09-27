const {UsersManager} = require("../../../bdd/classes/usersManager");
const {includedSimilarity} = require("../../processors/stringIncludeSimilarity");
const Discord = require("discord.js");
const {getUserICS, getUserList} = require("./cacheManager.js");
const { getFormatedNameFromString } = require("../../processors/getFormatedNameFromString");
const { AttachmentBuilder} = require('discord.js');
const path = require("path");

async function coreProcess(author, dates = [], search = null, target = null){
    var namedotsurname = null;
    //Fetch target URL
    if(target == null) target = author;
    if(typeof target === "string"){
        var users = await getUserList();
        namedotsurname = getFormatedNameFromString(target, users);
    }else{
        targetBddUser = await UsersManager.getUser(target.id);
        if(targetBddUser == null) {
            if(target.id == author.id) return "Une erreur s'est produite lors de votre identification. Veuillez réessayer.";
            else return "La cible demandé n'existe pas dans la base de données.";
        }
        namedotsurname = getFormatedNameFromString(await targetBddUser.getName() + " " + await targetBddUser.getSurname(), await getUserList());
    }
    
    //Fetch events from URL
    var ical = null;
    try{
        ical = await getUserICS(namedotsurname);
    }catch(err){
        if(global.debug) console.log(err);
        return "Une erreur s'est prduite à la récupération de l'emplois-du-temps. Veuillez réessayer.\n (*" + err + "*)";
    }

    if(ical == null) return "L'emplois-du-temps de la cible n'est pas disponible.";
    //Fetch events from dates
    var eventsFromDates = getICALEventsFromDate(dates, ical.ics);
    //Fetch events from searchs
    var eventFromSearch = search ? getICALEventFromSearch(search, ical.ics) : null;

    //Build reply
    var embed = new Discord.EmbedBuilder();
    embed.setColor(0xCC5500);
    if(search != null){
        if(eventFromSearch != null){
            embed.setTitle(`Événement trouvé le ${formatDayToString(eventFromSearch.start)}`);
            var searchString = search != "next" ? `<Recherche : "${ search }">` : `<Prochain cours>`;
            embed.setDescription(`${renderEvent(eventFromSearch)} \n*${ searchString }*`);
        } else {
            return "Aucun événement ne correspond à votre recherche.";
        }
    } else if(eventsFromDates.length == 1){
        embed.setTitle(`Événements du ${formatDayToString(eventsFromDates[0].date)}`);
        let dayString = renderDay(eventsFromDates[0]);
        //remove first line
        dayString = dayString.slice(dayString.indexOf("\n") + 1);
        embed.setDescription(`${dayString}`);
    } else {
        embed.addFields(getDays(eventsFromDates));
    }
    var updatedString = `${formatDayToString(ical.updated)} à ${ical.updated.getHours().toString().padStart(2, "0")}:${ical.updated.getMinutes().toString().padStart(2, "0")}`;
    embed.setFooter({text: `Données mise à jour le ${updatedString}, à titre indicatif uniquement.`});

    let icon = "icon.png";
    let iconAttachment = new AttachmentBuilder("requests/modules/planning/" + icon, icon);
    var name = namedotsurname.split(".")[0].slice(0, 1).toUpperCase() + namedotsurname.split(".")[0].slice(1);
    var surname = namedotsurname.split(".")[1].toUpperCase();
    embed.setAuthor({name: `Planning\n${name} ${surname}`, iconURL: 'attachment://'+icon});
    return {embeds: [embed], files: [iconAttachment]};
}

function getDays(eventsFromDates){
    var fields = [];
    for(var eventsFromDate of eventsFromDates){
        let day = renderDay(eventsFromDate);
        let dayDate = day.slice(0, day.indexOf("\n"));
        let dayContent = day.slice(day.indexOf("\n") + 1);
        fields.push({name: dayDate, value: dayContent});
    }
    return fields;
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
            dayString += `${prefix}\n`;
        }
        dayString = dayString.slice(0, -(prefix.length + 1));
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
    var startHour = event.start.getHours().toString().padStart(2, "0");
    var startMinute = event.start.getMinutes().toString().padStart(2, "0");
    var endHour = event.end.getHours().toString().padStart(2, "0");
    var endMinute = event.end.getMinutes().toString().padStart(2, "0");
    eventStartHourFormat = `${startHour}:${startMinute}`;
    eventEndHourFormat = `${endHour}:${endMinute}`;
    var eventString = "";
    var summary = event.summary.replace(/\n/g, " ");
    
    eventString += `${tabulation}▐ *${eventStartHourFormat} - ${eventEndHourFormat}*\n`;

    let summaryLines = [];
    while(summary.length > 0){
        let summaryWords = summary.split(" ");
        let summaryLine = "";
        while(summaryWords.length > 0 && summaryLine.length + summaryWords[0].length < 50){
            summaryLine += summaryWords.shift() + " ";
        }
        summary = summaryWords.join(" ");
        summaryLines.push(summaryLine);
    }

    for(var summaryLine of summaryLines){
        eventString += `${tabulation}▐    **${summaryLine}**\n`;
    }
    return eventString;
}

function getICALEventsFromDate(dates, events){
    if(!dates) return [];
    var eventsFromDates = [];
    for(var date of dates){
        var dateEvents = [];
        for(const [id, event] of Object.entries(events)){
            if(event.type != "VEVENT") continue;
            if(event.start.getTime() >= date.getTime() && event.end.getTime() <= (date.getTime() + 86400000)){
                dateEvents.push(event);
            }
        }
        dateEvents = dateEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
        eventsFromDates.push({date:date, events:dateEvents});
    }


    return eventsFromDates;
}

function getICALEventFromSearch(search, events){
    var searchWords = search.trim().split(" ");
    searchWords = searchWords.concat(getSearchWordsAliases(searchWords));
    searchWords = searchWords.filter((value) => typeof value === 'string' && value.length > 0);
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
            var includedWordSimilarity = includedSimilarity(event.summary + " " + event.description, searchWord);
            score += includedWordSimilarity < 0.5 ? 0 : includedWordSimilarity;
        }
        deltaTimeFromNow = Math.abs(event.start.getTime() - todayTime) + 0.1;
        eventsScores[id] = {event:event, score:score * Math.sqrt(1.0 / (deltaTimeFromNow))};
    }
    var maxScore = 0;
    for(const [id, eventContent] of Object.entries(eventsScores)){
        if(eventsScores[id].score > maxScore){
            maxScore = eventsScores[id].score;
            eventFromSearch = eventsScores[id].event;
        }
    }
    return eventFromSearch;
}

function getSearchWordsAliases(searchWords){
    const aliases = {
        "projet": ["projets"],
        "shes": ["sciences humaines et sociales"],
        "math": ["maths", "mathématiques"],
        "maths": ["mathématiques"],
        "elec": ["électronique"],
        "electronique": ["elec"],
        "omi": ["outils mathématiques pour l'ingénieur", "outils maths", "outils math"],
        "outils mathématiques pour l'ingénieur": ["omi", "outils maths", "outils math"],
        "outils maths": ["omi", "outils mathématiques pour l'ingénieur", "outils math"],
        "outils math": ["omi", "outils mathématiques pour l'ingénieur", "outils maths"],
        "info": ["informatique"],
        "algo": ["algorithmique"],
        "si": ["systèmes d'information", "sciences industrielles", "sciences de l'ingénieur"],
        "meca": ["mécanique"],
        "phys": ["physique"],
        "chim": ["chimie"],
        "lv1": ["anglais"],
        "lv2": ["allemand", "espagnol", "italien", "russe", "chinois", "japonais", "arabe", "portugais"],
        "cm": ["cours magistral", "amphi", "amphithéâtre"],
        "td": ["travaux dirigés"],
        "tp": ["travaux pratiques"],
        "ds": ["devoir surveillé", "examen"],
        "qcm": ["exam", "examen", "devoir surveillé"],
        "amphi": ["amphithéâtre"],
        "amphitheatre": ["amphi"],
        "auto": ["automatique"],
        "bdd": ["bases de données"],
    }

    var searchWordsAliases = [];
    for(var i = 0; i < searchWords.length; i++){
        var searchWord = searchWords[i].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        var searchWordAliases = aliases[searchWord];
        searchWordsAliases = searchWordsAliases.concat(searchWordAliases);
    }
    return searchWordsAliases;
}

module.exports = coreProcess; 