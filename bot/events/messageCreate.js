const {deleteChannel} = require('../utils/config-forms.js');

module.exports = {
    name: "messageCreate",
    once: false,
    execute(message) {
        /**
         * Emitted whenever a message is created.
         * @param {Message} message The message that got created
         * @event messageCreate
         * @returns {Promise<void>}
         */
        console.log(`Nouveau message par ${message.author.tag}: ${message.content} et en plus l'icon ${message.author.avatarURL()}`);
        console.log(`channel : ${message.channel}`);
        if(message.content==='SigmaDeleteChannel'){
            console.log(`\nmessage content: ${message.content}`);
            deleteChannel(message.guild,message.channel);
        }
    }
}