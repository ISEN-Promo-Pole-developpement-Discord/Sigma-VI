const {logAdminUpdate} = require('../modtools/log/log-admin.js');

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

          logAdminUpdate(
            oldChannel.guild,
            "Channel",
            null,
            null,
            oldChannel,
            newChannel
        );
    }
}