const {getActionAuthor} = require('../modtools/log/logger.js');
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
         *//*
         channel.messages.fetchPinned()
         .then(messages => console.log(`Received ${messages.size} messages`))
       console.log(`guild:  ${channel.message}, channel : ${channel} `)
         getActionAuthor(channel.guild, channel, "Channel").then(userAuthor => {
            logCreate(
               channel.guild,
               "pinned",
               null,
               channel,
               "admin",
           );
           console.log(`tag : ${userAuthor}`);
           })*/
    }
}