const {logCreate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "stickerCreate",
    once: false,
    execute(sticker) {
        /**
         * Triggered when a sticker gets created
         * @param {Sticker} sticker The sticker that got created
         * @returns {Promise<void>}
            */
         logCreate(
            sticker.guild,
            "Sticker",
            null,
            sticker,
            "admin",
        );
    }
}