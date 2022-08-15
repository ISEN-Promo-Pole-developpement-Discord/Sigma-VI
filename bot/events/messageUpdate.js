const {logUpdate} = require('../modtools/log/logModules.js');

module.exports = {
    name: "messageUpdate",
    once: false,
    execute(oldMessage, newMessage) {
        /**
         * Triggered when a message gets updated
         * @param {Message} oldMessage
         * @param {Message} newMessage
         * @returns {Promise<void>}
         */
        if (!oldMessage.author.bot)
            logUpdate(
                oldMessage.guild,
                "Message",
                oldMessage.author,
                null,
                oldMessage,
                newMessage,
                "user",
            );
    }
}