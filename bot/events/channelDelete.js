const {logDelete} = require('../modtools/log/log-admin.js');

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

         logDelete(
            channel.guild,
            "Channel",
            null,
            null,
            channel,
            "admin",
        );
    }
}