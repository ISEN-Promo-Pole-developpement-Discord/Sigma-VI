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

const { getGuildLogChannel } = require("./logger.js");
const { newEmbed } = require("../../utils/createEmbed.js");

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
    embedShematic.color = "#642eda";
    embed = newEmbed(embedShematic);
    try{
        logChannel.send({ embeds: [embed]});
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    logAdminUpdate
}