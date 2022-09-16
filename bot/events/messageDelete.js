const {logDelete} = require('../modtools/log/logModules.js');
const {ChannelType} = require("discord.js");

module.exports = {
    name: "messageDelete",
    once: false,
    execute(message) {
        /**
         * Emitted whenever a message is deleted.
         * @param {Message} message The message that got deleted
         * @event messageDelete
         * @returns {Promise<void>}
         */
        if(message.channel.type === ChannelType.DM) return;
         logDelete(
            message.guild,
            "Message",
            null,
            null,
            message,
            "user",
        );
     }
    }