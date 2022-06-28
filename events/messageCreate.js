module.exports = {
    name: "messageCreate",
    once: false,
    execute(message) {
        /**
         * Event qui se trigger lorsqu'un message est envoyé sur un serveur Discord (pas par DM visiblement)
         */
        console.log(`Nouveau message par ${message.author.tag}: ${message.content}`);
        
    }
}