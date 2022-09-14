const {ChannelType, MessageType} = require('discord.js');
const {Request} = require('./requestClass.js');
const {submitRequestToModule} = require('./modules/modulesManager.js');
const {getBestStringModule} = require('./processors/getScore.js');
const {testRequestScore} = require('./processors/tests.js');

// test modules validity and scoring at startup
testRequestScore();

async function updateRequestsFromMessage(message, client){

    if(!message.content || message.author.bot) return;
    // Fetch all message after the message
    var messages = await message.channel.messages.fetch({limit: 100, after: message.id});
    // Delete all message from the client wich respond to the message
    for(var m of messages.values()){
        if(m.author.id === client.user.id)
            if(m.type === MessageType.Reply && m.reference.messageId === message.id)
                await m.delete();
    }
    launchRequestProcessing(message, client);
}

async function launchRequestProcessing(message, client){
    var requests = await getRequestsFromMessage(message, client);
    for(var request of requests){
        let content = request.content.toLowerCase().trim();
        while(containACall(content, client))
            content = content.replace(containACall(content, client), "");
        request.content = content;
        var module = getBestStringModule(request.SRWF());
        if(module !== null) submitRequestToModule(request, module);
        else request.getMessage().react("❔");
    }
}

async function getRequestsFromMessage(message, client, force = false){
    var requests = new Array();
    
    // Discard if author is a bot
    if(message.author.bot) return requests;

    // Discard if message doesn't contain text
    if(!message.content) return requests;

    repliedMessage = null;
    if(message.reference && message.type === MessageType.Reply){
        repliedMessage = await message.fetchReference();
    }

    // Discard if message is not a valid call to the bot (Call wording, direct mention, private message, reply to a bot message, etc.)
    if(message.channel.type !== ChannelType.DM && !containACall(message.content, client) && !force){
        if(!repliedMessage || repliedMessage.author.id !== client.user.id)
            return requests;
    }

    // Redeploy to reference message if it's a reply with only a call to the bot
    if(repliedMessage){
        if(containACall(message.content, client, exclusive = true)){
            return getRequestsFromMessage(repliedMessage, client, force = true);
        }else return requests;
    }

    return [new Request(message, message.content)];
}

function containACall(string, client, exclusive = false){
    string = string.toLowerCase().trim();
    supportedCalls = ["sigma,", "sigma ?", "sigma !", "hey sigma", "dit sigma", "<@"+client.user.id+">", "<@!"+client.user.id+">", "<@&"+client.user.id+">"];
    if(exclusive) return supportedCalls.includes(string);
    let callFound = false;
    for(var call of supportedCalls){
        if(string.startsWith(call)) callFound = call;
    }
    return callFound;
}

module.exports = {updateRequestsFromMessage, launchRequestProcessing, getRequestsFromMessage};