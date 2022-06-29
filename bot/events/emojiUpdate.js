const {logAdminUpdate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "emojiUpdate",
    once: false,
    execute(oldEmoji, newEmoji) {
        /**
         * Triggered when an emoji gets updated
         * @param {Emoji} oldEmoji The old emoji
         * @param {Emoji} newEmoji The new emoji
         * @event emojiUpdate
         * @returns {Promise<void>}
         */
        logAdminUpdate(
            oldEmoji.guild, 
            `Emoji "${oldEmoji.name}" updated`, 
            null, 
            null, 
            [{name:"ID", value:oldEmoji.id, inline:true}, {name:"Creation", value:`<t:${Math.floor(newEmoji.createdTimestamp/1000)}:f>`, inline:true}], 
            oldEmoji.name, 
            newEmoji.name, 
            oldEmoji.url
        );
    }
}