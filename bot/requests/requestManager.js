const {ChannelType, MessageType} = require('discord.js');

function containACall(string, client, exclusive = false){
    string = string.toLowerCase().trim();
    supportedCalls = ["sigma,", "sigma ?", "dit sigma"];
    supportedCalls += ["<@"+client.user.id+">", "<@!"+client.user.id+">"];
    if(exclusive) return supportedCalls.includes(string);
    return supportedCalls.some(call => string.includes(call));
}

function isStringATagPatternOfID(string, id){
    if(string.startWiths('<') && string.endsWith('>') && string.length<25){
        return string.includes(id);
    }
    return false;
}

async function getRequestsFromMessage(message, client){
    var requests = new Array;

    // Discard if author is a bot
    if(message.author.bot) return requests;

    // Discard if message doesn't contain text
    if(!message.content) return requests;

    repliedMessage = null;
    if(message.reference && message.type === MessageType.Reply){
        repliedMessage = await message.fetchReference();
    }

    // Discard if message is not a valid call to the bot (Call wording, direct mention, private message, reply to a bot message, etc.)
    if(message.channel.type !== ChannelType.DM && !containACall(message.content, client)){
        if(!repliedMessage || repliedMessage.author.id !== client.user.id)
            return requests;
    }

    // Redeploy to reference message if it's a reply with only a call to the bot
    if(message.reference){
        if(isStringATagPatternOfID(message.content, client.user.id) || containACall(message.content, client, exclusive = true)){
            return getRequestsFromMessage(message.reference, client);
        }
    }
}