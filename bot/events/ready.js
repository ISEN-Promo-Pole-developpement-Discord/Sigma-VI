module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        /**
         * Event qui se trigger lorsque le client est lancé. Cet event ne s'éxécute qu'une fois
         */
        console.log(`Le bot ${client.user.tag} est lancé.`);
    }
}