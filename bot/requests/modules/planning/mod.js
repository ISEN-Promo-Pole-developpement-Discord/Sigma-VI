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
    request.content = filterOutDateElements(request.content, dates);
    request.content = filterBlackListedWords(request.content);

    
    var words = request.content.split(" ");
    var filteredWords = [];
    
    words = words.map(function(word){
        return word.toLowerCase().trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    });
    
    for(var word of words){
        if(!(keys[word] > 50)){
            if(mention){
                if(includedSimilarity(word, mention) > 0.9){
                    continue;
                }
            }
            filteredWords.push(word);
        }
    }
    
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
    
    let search = filtered.replaceAll(" ", "").length > 0 ? filtered : null;
    console.log(request.message.author, dates, search, target); 
    request.notifyEnd(await CORE(request.message.author, dates, search, target));
}

async function test(){
    var names = await getUserList();
    var formatedName = getFormatedNameFromString(" gadenne", names);
    console.log(formatedName);
}

test();

module.exports = moduleProcess;