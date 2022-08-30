const {logDelete} = require('../modtools/log/logModules.js');

module.exports = {
    name: "messageReactionRemoveAll",
    once: false,
    execute(message, reactions) {
        /**
         * Triggered when a message gets removed from all reactions
         * @param {Message} message
         * @param {Array<Reaction>} reactions
         * @returns {Promise<void>}
         */
         logDelete(
            message.guild,
            "messageRactionRemove",
            null,
            null,
            message,
            "admin",
         )
    }
}