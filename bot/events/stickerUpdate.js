const {logUpdate} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

module.exports = {
    name: "stickerUpdate",
    once: false,
    execute(oldSticker, newSticker) {
        /**
         * Emitted when a sticker is updated.
         * @param {Sticker} oldSticker The sticker before it was updated
         * @param {Sticker} newSticker The sticker after it was updated
         * @event stickerUpdate
         * @returns {Promise<void>}
            */
         getActionAuthor(oldSticker.guild, oldSticker, "oldSticker").then(userAuthor => {
         logUpdate(
            oldSticker.guild,
            "Sticker",
            {
                username: userAuthor.tag,
                avatarURL: userAuthor.displayAvatarURL(),
            },
            null,
            oldSticker,
            newSticker,
            "admin",
        );
    });
}
}