//const {logAdminCreate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "channelCreate",
    once: false,
    execute(channel) {
        /**
         * Triggered when a channel gets created
         * @param {Channel} channel The channel that got created
         * @event channelCreate
         */
/*
         logAdminCreate(
            channel.guild,
            "Channel",
            null,
            channel,
            "admin",
        );
*/
    }
}