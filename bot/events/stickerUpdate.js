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
    }
}