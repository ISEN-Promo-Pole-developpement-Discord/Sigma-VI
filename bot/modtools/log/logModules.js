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
const { ChannelType } = require("discord.js");

function logUpdate(guild, type, userAuthor, userTarget, oldObject, newObject,channel_log) {
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
    embedShematic.fields = removeDuplicates(embedShematic.fields);

    for(var field of embedShematic.fields){
        if(field.name === "Author"){
            const user = guild.members.cache.get(field.value);
            if(user.bot) return;
        }
    }
    

    embedShematic.color = "#642eda";
    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed]});
    } catch(e) {
        console.log(e);
    }
}

function logDelete(guild, type, userAuthor,userTarget,oldObject,channel_log) {
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
        embedShematic.thumbnail = {url: oldObject.displayAvatarURL()};
        embedShematic.fields = embedShematic.fields.concat(objectClassDataToFields(oldObject.user));
        for(let i = 0; i < embedShematic.fields.length; i++) {
            if(embedShematic.fields.map(x => {return x.name}).slice(i+1).includes(embedShematic.fields[i].name)
            || embedShematic.fields[i].name === "User" || embedShematic.fields[i].name === "DisplayName" || embedShematic.fields[i].name === "Avatar") {
                embedShematic.fields.splice(i, 1);
                i--;
            }
        }
    }

    if (type === "Channel") {
        switch (oldObject.type) {
            case ChannelType.DM:
                embedShematic.title = "DM" + embedShematic.title;
                break;
            case ChannelType.GroupDM:
                embedShematic.title = "Group DM" + embedShematic.title;
                break;
            case ChannelType.GuildCategory:
                embedShematic.title = "Category" + embedShematic.title.substring(7);
                break;
            case ChannelType.GuildDirectory:
                embedShematic.title = "Directory" + embedShematic.title.substring(7);
                break;
            case ChannelType.GuildForum:
                embedShematic.title = "Forum" + embedShematic.title.substring(7);
                break;
            case ChannelType.GuildNews:
                embedShematic.title = "News" + embedShematic.title;
                break;
            case ChannelType.GuildNewsThread:
                embedShematic.title = "News Thread" + embedShematic.title.substring(7);
                break;
            case ChannelType.GuildPrivateThread:
                embedShematic.title = "Private Thread" + embedShematic.title.substring(7);
                break;
            case ChannelType.GuildPublicThread:
                embedShematic.title = "Thread" + embedShematic.title.substring(7);
                break;
            case ChannelType.GuildStageVoice:
                embedShematic.title = "Stage" + embedShematic.title.substring(7);
                break;
            case ChannelType.GuildText:
                embedShematic.title = "Text" + embedShematic.title;
                break;
            case ChannelType.GuildVoice:
                embedShematic.title = "Voice" + embedShematic.title;
                break;
            default:
                embedShematic.title = "Unknown channel type" + embedShematic.title.substring(7);
                break;
        }
    }

    const deleteBlackList = ["RawPosition", "LastMessageId", "Position", "Preview", "Name"];
    embedShematic.fields = embedShematic.fields.filter((value, index, arr) => {
        return !deleteBlackList.includes(value.name);
    });
    
    embedShematic.fields = removeDuplicates(embedShematic.fields);
    
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
    if(userAuthor && userAuthor.bot) return;
    let logChannel = getGuildLogChannel(guild, "default");
    if(typeof channel_log === 'string' && channel_log ==="admin" || channel_log==="user" || channel_log ==='io') {
        logChannel = getGuildLogChannel(guild, channel_log);
    }
    if (!logChannel) return;
        let embedShematic = new Object();
        newObject.name ? 
            embedShematic.title = `${type} "${newObject.name}" Created`:
            embedShematic.title = `${type} Created`;
        if(newObject.url) embedShematic.url = newObject.url;
        if(userAuthor) embedShematic.footer = {text: userAuthor.tag, icon_url: userAuthor.displayAvatarURL()};
        if(newObject.image) embedShematic.image = {url: newObject.image};
        if(!newObject.timestamp){time=newObject.createdAt}

        embedShematic.fields = objectClassDataToFields(newObject);
        if(type === "GuildMember"){
            embedShematic.title = `${newObject.displayName} joined`;
            embedShematic.thumbnail = {url: newObject.displayAvatarURL()};
            embedShematic.fields = embedShematic.fields.concat(objectClassDataToFields(newObject.user));

            const createMemberBlackList = ["DisplayName", "Avatar", "Preview"];
            embedShematic.fields = embedShematic.fields.filter((value, index, arr) => {
                return !createMemberBlackList.includes(value.name);
            });
        }

        if (type === "Channel") {
            switch (newObject.type) {
                case ChannelType.DM:
                    embedShematic.title = "DM" + embedShematic.title;
                    break;
                case ChannelType.GroupDM:
                    embedShematic.title = "Group DM" + embedShematic.title;
                    break;
                case ChannelType.GuildCategory:
                    embedShematic.title = "Category" + embedShematic.title.substring(7);
                    break;
                case ChannelType.GuildDirectory:
                    embedShematic.title = "Directory" + embedShematic.title.substring(7);
                    break;
                case ChannelType.GuildForum:
                    embedShematic.title = "Forum" + embedShematic.title.substring(7);
                    break;
                case ChannelType.GuildNews:
                    embedShematic.title = "News" + embedShematic.title;
                    break;
                case ChannelType.GuildNewsThread:
                    embedShematic.title = "News Thread" + embedShematic.title.substring(7);
                    break;
                case ChannelType.GuildPrivateThread:
                    embedShematic.title = "Private Thread" + embedShematic.title.substring(7);
                    break;
                case ChannelType.GuildPublicThread:
                    embedShematic.title = "Thread" + embedShematic.title.substring(7);
                    break;
                case ChannelType.GuildStageVoice:
                    embedShematic.title = "Stage" + embedShematic.title.substring(7);
                    break;
                case ChannelType.GuildText:
                    embedShematic.title = "Text" + embedShematic.title;
                    break;
                case ChannelType.GuildVoice:
                    embedShematic.title = "Voice" + embedShematic.title;
                    break;
                default:
                    embedShematic.title = "Unknown channel type" + embedShematic.title.substring(7);
                    break;
            }
        }

        embedShematic.timestamp = new Date();
        embedShematic.color = "#00FF00";

        embedShematic.fields = removeDuplicates(embedShematic.fields);

        for(var field of embedShematic.fields){
            if(field.name === "Author"){
                const user = guild.members.cache.get(field.value);
                if(user.bot) return;
            }
        }
    
        
        const embed = newEmbed(embedShematic);
        try{
            logChannel.send({ embeds: [embed]});
        } catch(e) {
            console.log(e);
        }
}

function removeDuplicates(fields) {
    let fieldsFiltered = [];
    let fieldsFilteredNames = [];
    for (let i = 0; i < fields.length; i++) {
        if (!fieldsFilteredNames.includes(fields[i].name)) {
            fieldsFiltered.push(fields[i]);
            fieldsFilteredNames.push(fields[i].name);
        }
    }
    return fieldsFiltered;
}

module.exports = {
    logUpdate,
    logDelete,
    logCreate,
}
