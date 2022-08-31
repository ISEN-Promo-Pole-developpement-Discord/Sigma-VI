const {logDelete} = require('../modtools/log/logModules.js');

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