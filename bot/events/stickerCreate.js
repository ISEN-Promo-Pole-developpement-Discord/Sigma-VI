const {logCreate} = require('../modtools/log/log-admin.js');
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
         getActionAuthor(invite.guild, invite, "invite").then(userAuthor => {
         logCreate(
            sticker.guild,
            "Sticker",
            {
                username: userAuthor.tag,
                avatarURL: userAuthor.displayAvatarURL(),
            },
            sticker,
            "admin",
        );
    }
    )}
}