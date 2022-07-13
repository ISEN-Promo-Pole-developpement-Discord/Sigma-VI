const {logDelete} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');


module.exports = {
    name: "channelDelete",
    once: false,
    execute(channel) {
        /**
         * Triggered when a channel gets deleted
         * @param {Channel} channel The channel that got deleted
         * @event channelDelete
         * @returns {Promise<void>}
         */
         getActionAuthor(channel.guild, channel, "Channel").then(userAuthor => {
         logDelete(
            channel.guild,
            "Channel",
            {   
                username: userAuthor.tag,
                avatarURL: userAuthor.displayAvatarURL(),
            },
            null,
            channel,
            "admin",
        );
         })
    }
}