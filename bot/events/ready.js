module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        /**
         * Emitted when the client becomes ready to start working.
         * @param {Client} client The client that is ready
         * @event ready
         * @returns {Promise<void>}
         */
        console.log(`Le bot ${client.user.tag} est lancé.`);
    }
}