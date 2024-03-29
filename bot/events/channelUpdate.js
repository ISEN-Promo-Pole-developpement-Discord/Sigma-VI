const {logUpdate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');


module.exports = {
    name: "channelUpdate",
    once: false,
    execute(oldChannel, newChannel) {
        /**
         * Triggered when a channel gets updated
         * @param {Channel} oldChannel The old channel
         * @param {Channel} newChannel The new channel
         * @event channelUpdate
         */
        
          getActionAuthor(newChannel.guild, newChannel, "Channel").then(userAuthor => {
          logUpdate(
            oldChannel.guild,
            "Channel",
            userAuthor,
            null,
            oldChannel,
            newChannel,
            "admin",
        );
    });
    }
}