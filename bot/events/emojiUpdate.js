const {logUpdate} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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

        getActionAuthor(newEmoji.guild, newEmoji, "emoji").then(userAuthor => {
        logUpdate(
            newEmoji.guild,
            "Emoji",
            {   
                username: userAuthor.tag,
                avatarURL: userAuthor.displayAvatarURL(),
            },
            null,
            oldEmoji,
            newEmoji,
            "admin",
        );
        });
    }
}