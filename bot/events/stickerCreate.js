const {logCreate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

module.exports = {
    name: "stickerCreate",
    once: false,
    execute(sticker) {
        /**
         * Triggered when a sticker gets created
         * @param {Sticker} sticker The sticker that got created
         * @returns {Promise<void>}
            */
         getActionAuthor(sticker.guild, sticker, "sticker").then(userAuthor => {
         logCreate(
            sticker.guild,
            "Sticker",
            userAuthor,
            sticker,
            "admin",
        );
    }
    )}
}