const {logDelete} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

module.exports = {
    name: "stickerDelete",
    once: false,
    execute(sticker) {
        /**
         * Triggered when a sticker gets deleted
         * @param {Sticker} sticker The sticker that got deleted
         * @returns {Promise<void>}
            */

         getActionAuthor(sticker.guild, sticker, "sticker").then(userAuthor => {
         logDelete(
            sticker.guild,
            "Sticker",
            {
                username: userAuthor.tag,
                avatarURL: userAuthor.displayAvatarURL(),
            },
            null,
            sticker,
            "admin",
        );
    })
}
}