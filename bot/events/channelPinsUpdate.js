const {getActionAuthor,getLastMessagePinned} = require('../modtools/log/logger.js');
const {logCreate} = require('../modtools/log/log-admin.js');


module.exports = {
    name: "channelPinsUpdate",
    once: false,
    execute(channel, time) {
        /**
         * Triggered when a message gets pinned in a channel
         * @param {Channel} channel The channel the message got pinned in
         * @param {number} time The time the message got pinned
         * @event channelPinsUpdate
         * @returns {Promise<void>}
         */
         
         //getLastMessagePinned(channel.guild,channel);
         getActionAuthor(channel.guild, channel, "Channel").then(userAuthor => {
            logCreate(
               channel.guild,
               "pinned",
               null,
               channel,
               "admin",
           );
           })
  }
}