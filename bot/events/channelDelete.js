module.exports = {
    name: "channelDelete",
    once: false,
    execute(channel) {
        /**
         * Triggered when a channel gets deleted
         * @param {Channel} channel The channel that got deleted
         * @event channelDelete
         * @returns {Promise<void>}
         */
    }
}