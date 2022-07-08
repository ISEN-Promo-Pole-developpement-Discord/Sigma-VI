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

function logAdminCreate(guild, title, userAuthor, userTarget, name, id, timestamp, preview, image) {
    let logChannel = getGuildLogChannel(guild, "admin");
    if (!logChannel) return;
    let embedShematic = new Object();
    embedShematic.title = title;
    if(userAuthor) embedShematic.footer = {text: userAuthor.username, icon_url: userAuthor.avatarURL};
    if(userTarget) embedShematic.author = {name: userTarget.username, icon_url: userTarget.avatarURL};
    if(image) embedShematic.image = {url: image};
    embedShematic.fields = [
        {name: "Name", value: name, inline: false},
        {name: "ID", value: id, inline: false},
        {name: "Created", value: `<t:${Math.floor(timestamp/1000)}:f>`, inline: false},
    ];
    if (!image) embedShematic.fields = embedShematic.fields.concat([{name: "Preview", value: preview, inline: false}]);
    embedShematic.timestamp = new Date();
    embedShematic.color = "#642eda";
    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed]});
    } catch(e) {
        console.log(e);
    }
}

function logAdminUpdate(guild, type, userAuthor, userTarget, oldObject, newObject) {
    let logChannel = getGuildLogChannel(guild, "admin");
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
    }
}

function logAdminDelete(guild, title, userAuthor, userTarget, name, id, timestamp, image) {
    let logChannel = getGuildLogChannel(guild, "admin");
    if (!logChannel) return;
    let embedShematic = new Object();
    embedShematic.title = title;
    if(userAuthor) embedShematic.footer = {text: userAuthor.username, icon_url: userAuthor.avatarURL};
    if(userTarget) embedShematic.author = {name: userTarget.username, icon_url: userTarget.avatarURL};
    if(image) embedShematic.image = {url: image};
    embedShematic.fields = [
        {name: "Name", value: name, inline: false},
        {name: "ID", value: id, inline: false},
        {name: "Created", value: `<t:${Math.floor(timestamp/1000)}:f>`, inline: false},
    ];
    embedShematic.timestamp = new Date();
    embedShematic.color = "#642eda";
    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed]});
    } catch(e) {
        console.log(e);
    }
}
/*
function logAdminCreate(guild, type, userAuthor,newObject,channel_log) {
    let logChannel = getGuildLogChannel(guild,"default");
    if(typeof channel_log === 'string' && channel_log ==="admin" || channel_log==="user" || channel_log ==='io') {
        logChannel = getGuildLogChannel(guild, channel_log);
    }            
    if (!logChannel) return;
        let embedShematic = new Object();
        newObject.name ? 
            embedShematic.title = `${type} "${newObject.name}" Created`:
            embedShematic.title = `${type} Created`;

        if(userAuthor) embedShematic.footer = {text: userAuthor.username, icon_url: userAuthor.avatarURL};
        if(newObject.image) embedShematic.image = {url: newObject.image};
        embedShematic.fields = objectUpdateGetChangesFields(null, newObject);
            

        embedShematic.timestamp = new Date();
        embedShematic.color = "#642eda";

        const embed = newEmbed(embedShematic);
        try{
            logChannel.send({ embeds: [embed]});
        } catch(e) {
            console.log(e);
        }
}
*/


module.exports = {
    logAdminCreate,
    logAdminUpdate,
    logAdminDelete
}
