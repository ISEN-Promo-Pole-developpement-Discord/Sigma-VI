const {logDelete} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');
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
         getActionAuthor(message.guild, message, "name").then(userAuthor => {
         logDelete(
            message.guild,
            "Message",
            null,
            null,
            message,
            "user",
        );
     });
    }
}