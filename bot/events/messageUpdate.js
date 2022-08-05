const {logUpdate} = require('../modtools/log/log-admin.js');
const {updateRequestsFromMessage} = require('../requests/requestManager.js');

module.exports = {
    name: "messageUpdate",
    once: false,
    execute(oldMessage, newMessage) {
        /**
         * Triggered when a message gets updated
         * @param {Message} oldMessage
         * @param {Message} newMessage
         * @returns {Promise<void>}
         */
        if (!oldMessage.author.bot)
            logUpdate(
                oldMessage.guild,
                "Message",
                {
                    username: oldMessage.author.tag,
                    avatarURL: oldMessage.author.displayAvatarURL()
                },
                null,
                oldMessage,
                newMessage,
                "user",
            );
        updateRequestsFromMessage(newMessage, global.client);
    }
}