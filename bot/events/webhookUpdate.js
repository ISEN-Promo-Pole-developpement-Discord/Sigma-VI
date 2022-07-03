const {logAdminUpdate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "webhookUpdate",
    once: false,
    execute(channel) {
        /**
         * Triggered when a webhook gets updated
         * @param {Channel} channel The channel the webhook got updated in
         * @returns {Promise<void>}
         */
         logAdminUpdate(
            channel.guild,
            "Webhook",
            {
                username  : channel.name,
            },
            null,
            channel,
            channel,
        );/*
            channel.fetchWebhooks()
            .then(hooks => console.log(`This Channel has ${hooks.size} hook with ${hooks.webhooks} name`))
            .catch(console.error);
*/
    }
}