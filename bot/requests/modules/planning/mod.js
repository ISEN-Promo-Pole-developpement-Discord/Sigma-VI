const {Request} = require("../../requestClass");
const getMessageURLs = require("../../processors/getURLs");
const keys = require("./#keys.json");
const CORE = require("./core");
const { getFormatedNameFromString, } = require("../../processors/getFormatedNameFromString");
const {includedSimilarity} = require("../../processors/stringIncludeSimilarity");
const {getDatesFromString, filterOutDateElements} = require('../../processors/getAbsoluteDate.js');
const {getUserList} = require("./cacheManager.js");
const getMentions = require("../../processors/getMentions.js");
const filterBlackListedWords = require("../../processors/filterBlackListedWords.js");

async function moduleProcess(request){
    request.notifyStart();
    console.log("[PLANNING REQUEST] "+request.message.author.tag+" : "+request.content);

    // get specific arguments and filter them
    
    var names = await getUserList();
    
    var mention = getMentions(request.content)[0];
    var target = null;

    if(mention){
        var id = mention.replace(/[<@!?>]/g, "");
        target = global.client.users.cache.get(id);
        request.content = request.content.replace(mention, "");
    }
    var dates = getDatesFromString(request.content);

    const nextStrings = ["next", "prochain cours", "cours avec", "cours de", "evenement", "evenements", "prochains cours"];
    var nextStringRegex = new RegExp("\\b("+nextStrings.join("|")+")\\b", "gi");
    var search = null;
    if(nextStringRegex.test(request.content)){
        search = "next";
        request.content = request.content.replace(nextStringRegex, "");
    }

    request.content = filterOutDateElements(request.content);
    request.content = filterBlackListedWords(request.content);

    
    var words = request.content.split(" ");
    var filteredWords = [];
    
    words = words.map(function(word){
        return word.toLowerCase().trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    });
    
    for(var word of words){
        if(mention){
            if(includedSimilarity(word, mention) > 0.9 || includedSimilarity(mention, word) > 0.9){
                continue;
            }
        }
        filteredWords.push(word);
    }

    filteredWords = filteredWords.filter(function(word){
        for(var [key, value] of Object.entries(keys)){
            if(value > 50){
                if(includedSimilarity(word, key, 0.4, 1) > 0.75 || includedSimilarity(key, word, 0.4, 1) > 0.75){
                    return false;
                }
            }
        }
        return true;
    });
    
    var formatedName = getFormatedNameFromString(filteredWords.join(" "), names);
    words = filteredWords;
    filteredWords = [];

    for(var word of words){
        if(formatedName){
            var nameAndSurnam = formatedName.split(".");
            if(includedSimilarity(word, nameAndSurnam[0], 0.1, 10) > 0.2 || includedSimilarity(word, nameAndSurnam[1], 0.1, 10) > 0.2)
            continue;
        }
        filteredWords.push(word);
    }

    filtered = filteredWords.join(" ");

    if(formatedName && !target){
        target = formatedName;
    }
    
    search = filtered.replaceAll(" ", "").length > 0 ? filtered : search;
    if(search) search = search.trim();
    request.notifyEnd(await CORE(request.message.author, dates, search, target));
}

module.exports = moduleProcess;