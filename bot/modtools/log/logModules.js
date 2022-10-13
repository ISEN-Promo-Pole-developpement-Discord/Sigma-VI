const { getGuildLogChannel, objectClassDataToFields, objectUpdateGetChangesFields} = require("./logger.js");
const { newEmbed } = require("../../utils/createEmbed.js");
const { ChannelType } = require("discord.js");
const { AttachmentBuilder} = require('discord.js');
const logImg = require('./log-img.json');

// TODO: Log Module Manager need a complete revamp for better performance and readability.

function logUpdate(guild, type, userAuthor, userTarget, oldObject, newObject,channel_log) {
    if(!guild) return;
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

    if (type === "Channel" || type === "TextChannel" || type === "VoiceChannel" || type === "CategoryChannel") {
        embedShematic.title = getStringFromChannelType(oldObject.type) + embedShematic.title.replace(type, "");
        if(embedShematic.title.length > 256) embedShematic.title = embedShematic.title.slice(0, 250) + "...";
    }

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
    if(!embedShematic.fields) return;
    embedShematic.fields = removeDuplicates(embedShematic.fields);
    if(!embedShematic.fields.length) return;
    
    let img = null;
    imgData = getIcon("delete", type, embedShematic.title);
    if (imgData) {
        img = imgData.attachment;
        embedShematic.author = imgData.author;
        embedShematic.title = "";
    }

    embedShematic.color = "#642eda";
    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed], files: img ? [img] : []});
    } catch(e) {
        console.log(e);
    }
    
}

function logDelete(guild, type, userAuthor,userTarget,oldObject,channel_log) {
    if(!guild) return;
    if(userAuthor && userAuthor.bot) return;    
    let logChannel = getGuildLogChannel(guild, "default");
    if(typeof channel_log === 'string' && channel_log ==="admin" || channel_log==="user" || channel_log ==='io') {
        logChannel = getGuildLogChannel(guild, channel_log);
    }         
    if (!logChannel) return;
    let embedShematic = new Object();
    oldObject.name ? 
        embedShematic.title = `${type} "${oldObject.name}" Deleted`:
        embedShematic.title = `${type} Deleted`;
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

    if (type === "Channel" || type === "TextChannel" || type === "VoiceChannel" || type === "CategoryChannel") {
        embedShematic.title = getStringFromChannelType(oldObject.type) + embedShematic.title.replace(type, "");
        if(embedShematic.title.length > 256) embedShematic.title = embedShematic.title.slice(0, 250) + "...";
    }

    const deleteBlackList = ["RawPosition", "LastMessageId", "Position", "Preview", "Name"];
    embedShematic.fields = embedShematic.fields.filter((value, index, arr) => {
        return !deleteBlackList.includes(value.name);
    });

    let img = null;
    imgData = getIcon("delete", type, embedShematic.title);
    if (imgData) {
        img = imgData.attachment;
        embedShematic.author = imgData.author;
        embedShematic.title = "";
    }
    embedShematic.fields = removeDuplicates(embedShematic.fields);
    if(!embedShematic.fields.length) return;

    embedShematic.timestamp = new Date();
    embedShematic.color = "#FF0000";

    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed], files: img ? [img] : []});
    } catch(e) {
        console.log(e);
    }
}

function logCreate(guild, type, userAuthor,newObject,channel_log) {
    if(!guild) return;
    let img = null;
    
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

        if (type === "Channel" || type === "TextChannel" || type === "VoiceChannel" || type === "CategoryChannel") {
            embedShematic.title = getStringFromChannelType(newObject.type) + embedShematic.title.replace(type, "");
            if(embedShematic.title.length > 256) embedShematic.title = embedShematic.title.slice(0, 250) + "...";
        }

        imgData = getIcon("create", type, embedShematic.title);
        if (imgData) {
            img = imgData.attachment;
            embedShematic.author = imgData.author;
            embedShematic.title = "";
        }
        embedShematic.timestamp = new Date();
        embedShematic.color = "#00FF00";

        embedShematic.fields = removeDuplicates(embedShematic.fields);
        if(!embedShematic.fields.length) return;

        const embed = newEmbed(embedShematic);
        try{
            logChannel.send({ embeds: [embed], files: img ? [img] : []});
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

function getIcon(type, event, eventString){
    let icon = new Object();
    icon.attachment = null;
    icon.author = null;
    if(logImg[type.toLowerCase()]){
        typeImages = logImg[type.toLowerCase()];
        if(typeImages[event.toLowerCase()]){
            icon.attachment = new AttachmentBuilder(typeImages[event.toLowerCase()]);
            let imageName = typeImages[event.toLowerCase()].split("/").pop();
            icon.author = {name: eventString, icon_url: 'attachment://'+imageName};
            return icon;
        }
    }
    return null;
}

/**
 * @param {ChannelType} type 
 * @returns {String}
 */
function getStringFromChannelType(type) {
    switch (type) {
        case ChannelType.GuildText:
            return "Text Channel";
            case ChannelType.GuildVoice:
            return "Voice Channel";
        case ChannelType.GuildCategory:
            return "Category";
        case ChannelType.GuildAnnouncement:
            return "Announcement Channel";
        case ChannelType.AnnouncementThread:
            return "Announcement Thread";
        case ChannelType.PublicThread:
            return "Public Thread";
        case ChannelType.PrivateThread:
            return "Private Thread";
        case ChannelType.GuildStageVoice:
            return "Stage";
        case ChannelType.GuildDirectory:
            return "Directory";
        case ChannelType.GuildForum:
            return "Forum";
        case ChannelType.GuildNews:
            return "News Channel";
        case ChannelType.GuildNewsThread:
            return "News Thread";
        case ChannelType.GuildPublicThread:
            return "Thread";
        case ChannelType.GuildPrivateThread:
            return "Private Thread";
        default:
            return "Unknown Type";
    }
}

module.exports = {
    logUpdate,
    logDelete,
    logCreate,
}
