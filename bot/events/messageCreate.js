const { launchRequestProcessing } = require('../requests/requestManager.js');

module.exports = {
    name: "messageCreate",
    once: false,
    execute(message) {
        /**
         * Emitted whenever a message is created.
         * @param {Message} message The message that got created
         * @event messageCreate
         * @returns {Promise<void>}
         */

        if (message.author.bot) return;
        if (!message.content) return;
        if(global.config.core.modules === true){
            launchRequestProcessing(message, global.client);
        }
    }
}
