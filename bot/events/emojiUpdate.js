const {logAdminUpdate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "emojiUpdate",
    once: false,
    execute(oldEmoji, newEmoji) {
        /**
         * Triggered when an emoji gets updated
         * @param {Emoji} oldEmoji The old emoji
         * @param {Emoji} newEmoji The new emoji
         * @event emojiUpdate
         * @returns {Promise<void>}
         */
        logAdminUpdate(
            oldEmoji.guild,
            "Emoji",
            null,
            null,
            oldEmoji,
            newEmoji
        );
    }
}