module.exports = {
    name: "guildIntegrationsUpdate",
    once: false,
    execute(guild) {
        /**
         * Triggered when a channel follow gets added/removed or a webhook gets added/updated/removed
         * @param {Guild} guild The guild the channel follow got added/removed in
         * @event guildIntegrationsUpdate
         * @returns {Promise<void>}
         */
    }
}