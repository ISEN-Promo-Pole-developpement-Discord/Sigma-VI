const {logAdminUpdate} = require('../modtools/log/log-admin.js');

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
         logAdminUpdate(
            oldMessage.guild,
            `Message updated`,
            {
                username: oldMessage.author.tag,
                avatarURL: oldMessage.author.displayAvatarURL()
              },
              null,
            [{name:"ID", value:newMessage.id, inline:true}, {name:"Send", value:`<t:${Math.floor(newMessage.createdTimestamp/1000)}:f>`, inline:true},{name:"Channel", value:`${newMessage.channel}`, inline:true}],
            oldMessage.content,
            newMessage.content,
        );        
    }
}