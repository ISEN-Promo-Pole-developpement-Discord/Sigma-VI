const relativeIdentifiers = {
    0:{"3": ["apres-surlendemain", "apres surlendemain", "apres apres demain", "apres apres-demain", "after after tomorrow"]},
    1:{"2": ["apres-demain", "apres demain", "surlendemain", "after tomorrow"]},
    2:{"1": ["demain", "tomorrow"]},
    3:{"-2": ['avant-hier', "avant hier", "the day before yesterday"]},
    4:{"-1": ['hier', 'd\'hier', 'veille', 'yesterday']},
    5:{"0": ["aujourd'hui", "ajd", "now", "current", "today"]}
};

const weekDays = {
    0: ["dimanche", "sunday"],
    1: ["lundi", "monday"],
    2: ["mardi", "tuesday"],
    3: ["mercredi", "wednesday"],
    4: ["jeudi", "thursday"],
    5: ["vendredi", "friday"],
    6: ["samedi", "saturday"]
};

const months = {
    1: ["janvier", "january"],
    2: ["fevrier", "february"],
    3: ["mars", "march"],
    4: ["avril", "april"],
    5: ["mai", "may"],
    6: ["juin", "june"],
    7: ["juillet", "july"],
    8: ["aout", "august"],
    9: ["septembre", "september"],
    10: ["octobre", "october"],
    11: ["novembre", "november"],
    12: ["decembre", "december"]
};

const days = {
    1: ["1er", "premier", "un", "1st", "first"],
    2: ["2eme", "deuxieme", "deux", "2nd", "second"],
    3: ["3eme", "troisieme", "trois", "3rd", "third"],
    4: ["4eme", "quatrieme", "quatre", "4th", "fourth"],
    5: ["5eme", "cinquieme", "cinq", "5th", "fifth"],
    6: ["6eme", "sixieme", "six", "6th", "sixth"],
    7: ["7eme", "septieme", "sept", "7th", "seventh"],
    8: ["8eme", "huitieme", "huit", "8th", "eighth"],
    9: ["9eme", "neuvieme", "neuf", "9th", "ninth"],
    10: ["10eme", "dixieme", "dix", "10th", "tenth"],
    11: ["11eme", "onzieme", "onze", "11th", "eleventh"],
    12: ["12eme", "douzieme", "douze", "12th", "twelfth"],
    13: ["13eme", "treizieme", "treize", "13th", "thirteenth"],
    14: ["14eme", "quatorzieme", "quatorze", "14th", "fourteenth"],
    15: ["15eme", "quinzieme", "quinze", "15th", "fifteenth"],
    16: ["16eme", "seizieme", "seize", "16th", "sixteenth"],
    17: ["17eme", "dix-septieme", "dix-sept", "17th", "seventeenth"],
    18: ["18eme", "dix-huitieme", "dix-huit", "18th", "eighteenth"],
    19: ["19eme", "dix-neuvieme", "dix-neuf", "19th", "nineteenth"],
    20: ["20eme", "vingtieme", "vingt", "20th", "twentieth"],
    21: ["21eme", "vingt-et-unieme", "vingt-et-un", "21st", "twenty first"],
    22: ["22eme", "vingt-et-deuxieme", "vingt-et-deux", "22nd", "twenty second"],
    23: ["23eme", "vingt-et-troisieme", "vingt-et-trois", "23rd", "twenty third"],
    24: ["24eme", "vingt-et-quatrieme", "vingt-et-quatre", "24th", "twenty fourth"],
    25: ["25eme", "vingt-et-cinquieme", "vingt-et-cinq", "25th", "twenty fifth"],
    26: ["26eme", "vingt-et-sixieme", "vingt-et-six", "26th", "twenty sixth"],
    27: ["27eme", "vingt-et-septieme", "vingt-et-sept", "27th", "twenty seventh"],
    28: ["28eme", "vingt-et-huitieme", "vingt-et-huit", "28th", "twenty eighth"],
    29: ["29eme", "vingt-et-neuvieme", "vingt-et-neuf", "29th", "twenty ninth"],
    30: ["30eme", "trentieme", "trente", "30th", "thirtieth"],
    31: ["31eme", "trente-et-unieme", "trente-et-un", "31st", "thirty first"]
};

const week = ["semaine", "week"];
const weekend = ["weekend", "we"];
const month = ["mois", "month"];
const year = ["annee", "year"];

const next = ["prochain", "next", "prochaine"];
const previous = ["precedent", "precedente", "dernier", "derniere", "previous"];

// FOR SOME REASON, getDay() returns 0 for saturday, 1 for sunday, etc.
// So most of the time, we need to add 1 to get the correct day. That's dumb.
// We should fix this.

var today;

function getDatesFromString(string, reference = null){
    if(reference !== null){
        today = reference;
    }else{
        today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    var startDate = getStartDate(string);
    var endDate = getEndDate(string, startDate);
    if(!startDate) return [today];
    if(!endDate) return [startDate];
    else {
        var dates = [];
        for(var i = new Date(startDate.getTime()); i <= endDate; i.setDate(i.getDate()+1)){
            dates.push(new Date(i.getTime()));
        }
        return dates;
    }
}

function getStartDate(string){
    const relativeIdentifier = includeRelativeIdentifier(string);
    if(relativeIdentifier !== false){
        var msInDay = 1000 * 60 * 60 * 24;
        var date = new Date(today.getTime() + (msInDay * relativeIdentifier));
        return date;
    }
    const fullDate = getFullDate(string);
    if(fullDate){
        const weekRelative = getWeekRelative(string, fullDate);
        if(weekRelative) return weekRelative;
        else return fullDate;
    }
    const weekDayRelative = getWeekDayRelative(string);
    if(weekDayRelative !== false) return weekDayRelative;
    const weekRelative = getWeekRelative(string);
    if(weekRelative !== false) return weekRelative;
    const weekDay = includeWeekDay(string);
    if(weekDay !== false) return getWeekDayRelative("next "+weekDays[weekDay][0]);
    return null;
}

function getEndDate(string, startDate){
    const week = includeWeek(string);
    if(week){
        var msInDay = 1000 * 60 * 60 * 24;
        return new Date(startDate.getTime() + (msInDay * 6));
    }
    return null;
}

function includeRelativeIdentifier(string){
    for(var i in relativeIdentifiers){
        for(var subKey in relativeIdentifiers[i]){
            for(var key in relativeIdentifiers[i][subKey]){
                var regex = new RegExp("\\b" + relativeIdentifiers[i][subKey][key] + "\\b", "gi");
                if(regex.test(string)){
                    return parseInt(subKey);
                }
            }
        }
    }
    return false;
}

// get "Next WD" format
function getWeekDayRelative(string, reference = null){
    if(reference === null) reference = today;
    const weekDay = includeWeekDay(string);
    const weekDayArgument = includeWeekDayArgument(string);
    if(weekDay !== false && weekDayArgument !== false){
        const n = weekDayArgument === "next" ? 1 : -1;
        var date = new Date(reference.getTime());
        do{
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+n);
        }while((date.getDay() < 0 ? 6 : date.getDay()) != weekDay);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return date;
    }
    return false;
}

function getWeekRelative(string, reference = null){
    if(reference === null) reference = today;
    
    if(includeWeek(string)){
        var weekArgurment = includeWeekArgument(string);
        thisWeekMonday = reference.getDay() == 2 ? reference : getWeekDayRelative(`previous monday`, reference);
        //Week planning asked during WE -> next week 
        if(weekArgurment === false){
            if(reference.getDay() < 2) return getWeekDayRelative(`next monday`, reference);
            else return new Date(thisWeekMonday.getTime());
        }
        if(weekArgurment === "next") return new Date(thisWeekMonday.getFullYear(), thisWeekMonday.getMonth(), thisWeekMonday.getDate()+7);
        else return new Date(thisWeekMonday.getFullYear(), thisWeekMonday.getMonth(), thisWeekMonday.getDate()-7);
    }
    return false;
}

function getFullDate(string){
    //get DD/MM/YYYY format
    var date = string.match(/\d{2}\/\d{2}\/\d{4}/);
    if(date){
        var date = date[0].split("/").map(x => parseInt(x));
        return new Date(date[2], date[1]-1, date[0]);
    }

    //get DD/MM format
    var date = string.match(/\d{2}\/\d{2}/);
    if(date){
        var date = date[0].split("/").map(x => parseInt(x));
        if(today.getMonth() - date[1] > 2) return new Date(today.getFullYear()+1, date[1]-1, date[0]);
        else return new Date(today.getFullYear(), date[1]-1, date[0]);
    }

    const monthDay = includeMonthDay(string);
    if(monthDay === false) return false;
    var month = includeMonth(string);
    if(month === false){
        if(monthDay < today.getDate())
            return new Date(today.getFullYear(), today.getMonth()+1, monthDay);
        else return new Date(today.getFullYear(), today.getMonth(), monthDay);
    }
    var year = includeYear(string);
    if(year === false) year = new Date().getFullYear();
    return new Date(year, month-1, monthDay);
}

function includeWeek(string){
    for(var i in week){
        var regex = new RegExp("\\b" + week[i] + "\\b", "gi");
        if(regex.test(string)) return true;
    }
    return false;
}

function includeWeekArgument(string){
    for(var i in next){
        var regex = new RegExp("\\b" + next[i] + "\\b", "gi");
        if(regex.test(string)) return "next";
    }
    for(var i in previous){
        var regex = new RegExp("\\b" + previous[i] + "\\b", "gi");
        if(regex.test(string)) return "previous";
    }
    return false;
}

function includeWeekDay(string){
    for(var i in weekDays){
        for(var key in weekDays[i]){
            var regex = new RegExp("\\b" + weekDays[i][key] + "\\b", "gi");
            if(regex.test(string)) return i;
        }
    }
    return false;
}

function includeWeekDayArgument(string){
    for(var i in weekDays){
        for(var key in weekDays[i]){
            var regex = new RegExp("\\b" + weekDays[i][key] + "\\b", "gi");
            if(regex.test(string)){
                var index = string.indexOf(weekDays[i][key]);
                var afterWeekday = string.substring(index+weekDays[i][key].length);
                var afterWeekdayWords = afterWeekday.trim().split(" ");
                var beforeWeekday = string.substring(0, index);
                var beforeWeekdayWords = beforeWeekday.trim().split(" ");
                if(next.includes(afterWeekdayWords[0]) || next.includes(beforeWeekdayWords[0])){
                    return "next";
                }
                else if(previous.includes(afterWeekdayWords[0]) || previous.includes(beforeWeekdayWords[0])){
                    return "previous";
                }
                return false;
            }
        }
    }
    return false;
}

function includeMonthDay(string){
    for(var i in days){
        for(var key in days[i]){
            var regex = new RegExp("\\b" + days[i][key] + "\\b", "gi");
            if(regex.test(string)) return i;
        }
    }
    //Get day number before or after month
    var month = null;
    for(var i in months){
        for(var key in months[i]){
            var regex = new RegExp("\\b" + months[i][key] + "\\b", "gi");
            if(regex.test(string)){
                month = months[i][key];
                break;
            }
        }
    }
    if(month === null){
        var match = string.match(/\d+/);
        if(match){
            return parseInt(match[0]);
        }
        return false;
    }
    var monthIndexStart = string.indexOf(month);
    var monthIndexEnd = monthIndexStart + month.length;
    var beforeString = string.substring(0, monthIndexStart);
    var afterString = string.substring(monthIndexEnd);
    var match = beforeString.match(/\d+/) || afterString.match(/\d+/);
    if(match){
        return parseInt(match[0]);
    }
    return false;
}


function includeMonth(string){
    for(var i in months){
        for(var key in months[i]){
            var regex = new RegExp("\\b" + months[i][key] + "\\b", "gi");
            if(regex.test(string)) return i;
        }
    }
    return false;
}

function includeYear(string){
    var regex = /\d{2}[0-9]{2}/;
    var match = string.match(regex);
    if(match){
        return match[0];
    }
    return false;
}

function recurciveObjectDestruction(object){
    var items = [];
    if(Array.isArray(object)){
        for(var i of object){
            if(Array.isArray(i)){
                items = items.concat(recurciveObjectDestruction(i));
            }else items.push(recurciveObjectDestruction(i));
        }
    }else if(typeof object === "object"){
        for(const [key, value] of Object.entries(object)){
            items.push(recurciveObjectDestruction(value));
        }
    } if(typeof object === "string"){
        return object;
    }
    if(items.length > 0){
        var containOnlyStrings = true;
        for(var i of items){
            if(typeof i !== "string"){
                containOnlyStrings = false;
                break;
            }
        }
        if(!containOnlyStrings){
            return recurciveObjectDestruction(items);
        }
    }
    return items;
}

function filterOutDateElements(string){
    string = string.trim();
    var dateElements = recurciveObjectDestruction([previous, next, weekend, month, year, weekDays, days, months, week, relativeIdentifiers]);
    const regexYear = /\b\d{2}[0-9]{2}\b/;
    const regexDay = /\b\d{1,2}\b/;
    const regexDate1 = /\b\d{1,2}\/\d{1,2}\b/;
    const regexDate2 = /\b\d{1,2}\/\d{1,2}\/\d{0,2}[0-9]{0,2}\b/;
    const b = "\\b";
    var dateElementsRegex = new RegExp(b + dateElements.join(b + "|" + b) + b, "gi");
    var string = string.replace(dateElementsRegex, "");
    string = string.replace(regexDate2, "");
    string = string.replace(regexDate1, "");
    string = string.replace(regexYear, "");
    string = string.replace(regexDay, "");
    var regexExtraSpaces = /\s{2,}/g;
    string = string.replace(regexExtraSpaces, " ");
    return string.trim();
}

//TODO: add support for following formats:
// - "derniere semaine octobre"
// - "derniere semaine octobre 2018"
// - "premiere semaine octobre"
// - "dans deux semaines"
// - "d'il y a deux semaines"


module.exports = {getDatesFromString, filterOutDateElements};