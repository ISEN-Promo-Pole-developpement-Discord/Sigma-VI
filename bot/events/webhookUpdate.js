const {logUpdate} = require('../modtools/log/log-admin.js');

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

        getWebhooks(channel).then(function(webhooks) {
            console.log(webhooks);

            webhooks.forEach((webhook, snowflake) => {
                console.log(webhook.name);
            });
        });

        logUpdate(
            channel.guild,
            "Webhook",
            null,
            null,
            channel,
            channel,
            "admin"
        );

    }
}