const {logDelete} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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
         getActionAuthor(emoji.guild, emoji, "emoji").then(userAuthor => {
         logDelete(
            emoji.guild,
            "Emoji",
            {   
                username: userAuthor.tag,
                avatarURL: userAuthor.displayAvatarURL(),
            },
            null,
            emoji,
            "admin",
        );
    })}
}