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
        console.log("message Reaction remove")
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