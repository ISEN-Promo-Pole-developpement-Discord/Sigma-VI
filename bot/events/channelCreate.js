const {logCreate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

module.exports = {
    name: "channelCreate",
    once: false,
    execute(channel) {
        /**
         * Triggered when a channel gets created
         * @param {Channel} channel The channel that got created
         * @event channelCreate
         */

         getActionAuthor(channel.guild, channel, "Channel").then(userAuthor => {
         logCreate(
            channel.guild,
            "Channel",
            userAuthor,
            channel,
            "admin",
        );
        })

    }
}