const {logCreate} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');


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
         getActionAuthor(emoji.guild, emoji, "emoji").then(userAuthor => {
         logCreate(
            emoji.guild,
            "Emoji",
            userAuthor,
            emoji,
            "admin",
        );
    })}
   

}