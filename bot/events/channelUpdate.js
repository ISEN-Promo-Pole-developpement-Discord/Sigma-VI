const {logUpdate} = require('../modtools/log/log-admin.js');
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
        /*
        oldChannel.permissionOverwrites.cache.forEach((snowflake, permOverwrites) => {
            console.log(snowflake);
            console.log(permOverwrites);
          });
          */
          getActionAuthor(newChannel.guild, newChannel, "Channel").then(userAuthor => {
          logUpdate(
            oldChannel.guild,
            "Channel",
            {   
                username: userAuthor.tag,
                avatarURL: userAuthor.displayAvatarURL(),
            },
            null,
            oldChannel,
            newChannel,
            "admin",
        );
    });
    }
}