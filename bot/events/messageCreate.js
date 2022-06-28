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
        
    }
}