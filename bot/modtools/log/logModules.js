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
    console.log(`bot : ${userAuthor.bot}`);
    if(userAuthor && userAuthor.bot) return;    
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
            embedShematic.author = {name: userTarget.tag, icon_url: userTarget.displayAvatarURL()};
            embedShematic.footer = {text: userAuthor.tag, icon_url: userAuthor.displayAvatarURL()};
        } 
        else embedShematic.author = {name: userAuthor.tag, icon_url: userAuthor.displayAvatarURL()};
    }

    if(newObject.iconURL) embedShematic.image = {url: newObject.iconURL()};
    else if(newObject.url) embedShematic.image = {url: newObject.url};

    embedShematic.timestamp = new Date();
    embedShematic.fields = objectUpdateGetChangesFields(oldObject, newObject);
    embedShematic.color = "#642eda";
    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed]});
    } catch(e) {
        console.log(e);
    }
}

function logDelete(guild, type, userAuthor,userTarget,oldObject,channel_log) {
    console.log(`bot : ${userAuthor.bot}`);
    if(userAuthor && userAuthor.bot) return;    
    let logChannel = getGuildLogChannel(guild,"default");
    if(typeof channel_log === 'string' && channel_log ==="admin" || channel_log==="user" || channel_log ==='io') {
        logChannel = getGuildLogChannel(guild, channel_log);
    }         
    if (!logChannel) return;
    let embedShematic = new Object();
    oldObject.name ? 
        embedShematic.title = `${type} "${oldObject.name}" Delete`:
        embedShematic.title = `${type} Delete`;
    if(userAuthor) embedShematic.footer = {text: userAuthor.tag, icon_url: userAuthor.displayAvatarURL()};
    if(oldObject.image) embedShematic.image = {url: oldObject.image};
    if(userTarget) embedShematic.author = {name: userTarget.tag, icon_url: userTarget.displayAvatarURL()};
    if(!oldObject.timestamp){time=oldObject.createdAt}
    
    embedShematic.fields = objectClassDataToFields(oldObject);
    if(type === "GuildMember"){
        embedShematic.title = `${oldObject.displayName} left`;
        embedShematic.fields = embedShematic.fields.concat(objectClassDataToFields(oldObject.user));
        for(let i = 0; i < embedShematic.fields.length; i++) {
            if(embedShematic.fields.map(x => {return x.name}).slice(i+1).includes(embedShematic.fields[i].name)) {
                embedShematic.fields.splice(i, 1);
                i--;
            }
        }
    }
    embedShematic.timestamp = new Date();
    embedShematic.color = "#FF0000";

    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed]});
    } catch(e) {
        console.log(e);
    }
}

function logCreate(guild, type, userAuthor,newObject,channel_log) {
    console.log(`bot : ${userAuthor}`);
    if(userAuthor && userAuthor.bot) return;
    let logChannel = getGuildLogChannel(guild,"default");
    if(typeof channel_log === 'string' && channel_log ==="admin" || channel_log==="user" || channel_log ==='io') {
        logChannel = getGuildLogChannel(guild, channel_log);
    }            
    if (!logChannel) return;
        let embedShematic = new Object();
        newObject.name ? 
            embedShematic.title = `${type} "${newObject.name}" Created`:
            embedShematic.title = `${type} Created`;
        if(userAuthor) embedShematic.footer = {text: userAuthor.tag, icon_url: userAuthor.displayAvatarURL()};
        if(newObject.image) embedShematic.image = {url: newObject.image};
        if(!newObject.timestamp){time=newObject.createdAt}

        embedShematic.fields = objectClassDataToFields(newObject);
        if(type === "GuildMember"){
            embedShematic.title = `${newObject.displayName} joined`;
            embedShematic.fields = embedShematic.fields.concat(objectClassDataToFields(newObject.user));
            for(let i = 0; i < embedShematic.fields.length; i++) {
                if(embedShematic.fields.map(x => {return x.name}).slice(i+1).includes(embedShematic.fields[i].name)) {
                    embedShematic.fields.splice(i, 1);
                    i--;
                }
            }
        }

        embedShematic.timestamp = new Date();
        embedShematic.color = "#00FF00";

        const embed = newEmbed(embedShematic);
        try{
            logChannel.send({ embeds: [embed]});
        } catch(e) {
            console.log(e);
        }
}


module.exports = {
    logUpdate,
    logDelete,
    logCreate,
}
