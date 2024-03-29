const {logUpdate} = require('../modtools/log/logModules.js');

async function getWebhooks(channel) {
    return await channel.fetchWebhooks();
}

module.exports = {
    name: "webhookUpdate",
    once: false,
    execute(channel) {
        /**
         * Triggered when a webhook gets updated
         * @param {Channel} channel The channel the webhook got updated in
         * @returns {Promise<void>}
         */
    }
}