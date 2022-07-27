/**
 * events types:
 * - "new" event
 * > guild - guild object
 * > userAuthor - user who made the action
 * > userTarget - user who was affected
 * - "edit" event
 * - "delete" event
 * - "ban" event
 * - "unban" event
 * - "kick" event
 */

/**
 * - channelCreate
 * - emojiCreate
 * - guildScheduledEventCreate
 * - inviteCreate
 * - roleCreate
 * - stageInstanceCreate
 * - stickerCreate
 * 
 * - emojiDelete
 * - channelDelete
 * - guildScheduledEventDelete
 * - inviteDelete
 * - messageReactionRemoveAll
 * - roleDelete
 * - stageInstanceDelete
 * - stickerDelete
 * 
 * - channelUpdate
 * - emojiUpdate
 * - guildMemberUpdate
 * - guildScheduledEventUpdate
 * - guildUpdate
 * - webhookUpdate
 * - roleUpdate
 * - stageInstanceUpdate
 * - stickerUpdate
 *  
 * - GuildBanAdd
 * - GuildBanRemove
 * 
 */

const { getGuildLogChannel, objectClassDataToFields, objectUpdateGetChangesFields} = require("./logger.js");
const { newEmbed } = require("../../utils/createEmbed.js");

function logUpdate(guild, type, userAuthor, userTarget, oldObject, newObject,channel_log) {
    if((userAuthor.bot===false)){
    let logChannel = getGuildLogChannel(guild,"default");
    if(typeof channel_log === 'string' && channel_log ==="admin" || channel_log==="user" || channel_log ==='io') {
        logChannel = getGuildLogChannel(guild, channel_log);
    }   
    if (!logChannel) return;
    let embedShematic = new Object();
    oldObject.name ? 
        embedShematic.title = `${type} "${oldObject.name}" updated`:
        embedShematic.title = `${type} updated`;
    if(newObject.url) embedShematic.url = newObject.url;

    if(userAuthor){
        if(userTarget){
            embedShematic.author = {name: userTarget.username, icon_url: userTarget.avatarURL};
            embedShematic.footer = {text: userAuthor.username, icon_url: userAuthor.avatarURL};
        } 
        else embedShematic.author = {name: userAuthor.username, icon_url: userAuthor.avatarURL};
    }

    if(newObject.iconURL) embedShematic.image = {url: newObject.iconURL()};
    else if(newObject.url) embedShematic.image = {url: newObject.url};

    embedShematic.timestamp = new Date();
    embedShematic.fields = objectUpdateGetChangesFields(oldObject, newObject);
    embedShematic.fields = embedShematic.fields.concat(objectClassDataToFields(newObject));
    embedShematic.color = "#642eda";
    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed]});
    } catch(e) {
        console.log(e);
    }}
}

function logDelete(guild, type, userAuthor,userTarget,oldObject,channel_log) {
    if((userAuthor.bot===false)){
    let logChannel = getGuildLogChannel(guild,"default");
    if(typeof channel_log === 'string' && channel_log ==="admin" || channel_log==="user" || channel_log ==='io') {
        logChannel = getGuildLogChannel(guild, channel_log);
    }            
    if (!logChannel) return;
        let embedShematic = new Object();
        oldObject.name ? 
            embedShematic.title = `${type} "${oldObject.name}" Delete`:
            embedShematic.title = `${type} Delete`;
        if(type === "GuildMember") embedShematic.title = `${oldObject.displayName} left`;
        if(userAuthor) embedShematic.footer = {text: userAuthor.username, icon_url: userAuthor.avatarURL};
        if(oldObject.image) embedShematic.image = {url: oldObject.image};
        if(userTarget) embedShematic.author = {name: userTarget.username, icon_url: userTarget.avatarURL};
        if(!oldObject.timestamp){time=oldObject.createdAt}
        
        embedShematic.fields = objectClassDataToFields(oldObject);
        embedShematic.timestamp = new Date();
        embedShematic.color = "#FF0000";

        const embed = newEmbed(embedShematic);
        try{
            logChannel.send({ embeds: [embed]});
        } catch(e) {
            console.log(e);
        }
}
}

function logCreate(guild, type, userAuthor,newObject,channel_log) {
    if((userAuthor.bot===false)){
    let logChannel = getGuildLogChannel(guild,"default");
    if(typeof channel_log === 'string' && channel_log ==="admin" || channel_log==="user" || channel_log ==='io') {
        logChannel = getGuildLogChannel(guild, channel_log);
    }            
    if (!logChannel) return;
        let embedShematic = new Object();
        newObject.name ? 
            embedShematic.title = `${type} "${newObject.name}" Created`:
            embedShematic.title = `${type} Created`;
        if(type === "GuildMember") embedShematic.title = `${newObject.displayName} joined`;
        if(userAuthor) embedShematic.footer = {text: userAuthor.username, icon_url: userAuthor.avatarURL};
        if(newObject.image) embedShematic.image = {url: newObject.image};
        if(!newObject.timestamp){time=newObject.createdAt}

        embedShematic.fields = objectClassDataToFields(newObject);

        embedShematic.timestamp = new Date();
        embedShematic.color = "#00FF00";

        const embed = newEmbed(embedShematic);
        try{
            logChannel.send({ embeds: [embed]});
        } catch(e) {
            console.log(e);
        }
}
}


module.exports = {
    logUpdate,
    logDelete,
    logCreate,
}
