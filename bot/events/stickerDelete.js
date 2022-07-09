const {logDelete} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "stickerDelete",
    once: false,
    execute(sticker) {
        /**
         * Triggered when a sticker gets deleted
         * @param {Sticker} sticker The sticker that got deleted
         * @returns {Promise<void>}
            */
         logDelete(
            sticker.guild,
            "Sticker",
            null,
            null,
            sticker,
            "admin",
        );
    }
}