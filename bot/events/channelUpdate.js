module.exports = {
    name: "channelUpdate",
    once: false,
    execute(oldChannel, newChannel) {
        /**
         * Triggered when a channel gets updated
         * @param {Channel} oldChannel The old channel
         * @param {Channel} newChannel The new channel
         * @event channelUpdate
         */
    }
}