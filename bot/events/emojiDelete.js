module.exports = {
    name: "emojiDelete",
    once: false,
    execute(emoji) {
        /**
         * Triggered when an emoji gets deleted
         * @param {Emoji} emoji The emoji that got deleted
         * @event emojiDelete
         * @returns {Promise<void>}
         */
    }
}