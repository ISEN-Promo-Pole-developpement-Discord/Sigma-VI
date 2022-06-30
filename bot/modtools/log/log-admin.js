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

const { getGuildLogChannel, objectClassDataToFields} = require("./logger.js");
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
    console.log(embedShematic);
    const embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed]});
    } catch(e) {
        console.log(e);
    }
}

function logAdminUpdate(guild, title, userAuthor, userTarget, data, oldValue, newValue, image) {
    let logChannel = getGuildLogChannel(guild, "admin");
    if (!logChannel) return;
    let embedShematic = new Object();
    embedShematic.title = title;
    if(userAuthor) embedShematic.footer = {text: userAuthor.username, icon_url: userAuthor.avatarURL};
    if(userTarget) embedShematic.author = {name: userTarget.username, icon_url: userTarget.avatarURL};
    if(image) embedShematic.image = {url: image};
    embedShematic.fields = [{name: "Old value", value: oldValue, inline: false}, {name: "New value", value: newValue, inline: false}];
    embedShematic.timestamp = new Date();
    embedShematic.fields = embedShematic.fields.concat(data);
    embedShematic.fields = embedShematic.fields.concat(objectClassDataToFields(newValue));
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

module.exports = {
    logAdminCreate,
    logAdminUpdate,
    logAdminDelete
}