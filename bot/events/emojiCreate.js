module.exports = {
    name: "emojiCreate",
    once: false,
    execute(emoji) {
        /**
         * Triggered when an emoji gets created
         * @param {Emoji} emoji The emoji that got created
         * @event emojiCreate
         * @returns {Promise<void>}
         */
    }
}