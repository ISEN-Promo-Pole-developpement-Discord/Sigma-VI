// [Guild ID] => {adminLog: [Channel ID], ioLog: [Channel ID], userLog: [Channel ID]}
var guildLogMap = new Map();

const {logAdminChannelName, logIoChannelName, logUserChannelName} = require("../../config-core.json");

function getGuildLogChannel(guild, type) {
    if (!guildLogMap.has(guild.id)) {
        let adminLogChannel = guild.channels.cache.find(channel => channel.name === logAdminChannelName);
        let ioLogChannel = guild.channels.cache.find(channel => channel.name === logIoChannelName);
        let userLogChannel = guild.channels.cache.find(channel => channel.name === logUserChannelName);
        guildLogMap.set(guild.id, {admin: adminLogChannel, io: ioLogChannel, user: userLogChannel});
    }
    return guildLogMap.get(guild.id)[type];
}

module.exports = {
    getGuildLogChannel
}