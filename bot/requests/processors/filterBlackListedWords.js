const context = require('./wordLists/context.json');
const greetings = require('./wordLists/greetings.json');

function filterBlackListedWords(string){
    string = string.replace(/[.,;:?!]/g," ");
    apostropheRegex = new RegExp("([a-z])'", "gi");
    string = string.replace(apostropheRegex, "");
    var b = "\\b";
    var allRegex = new RegExp(b + context.join(b + "|" + b) + b + "|" + b + greetings.join(b + "|" + b) + b, "gi");
    return string.replace(allRegex, "");
}

module.exports = filterBlackListedWords;