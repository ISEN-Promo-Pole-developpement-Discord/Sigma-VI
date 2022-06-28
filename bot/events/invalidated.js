module.exports = {
    name: "invalidated",
    once: false,
    execute() {
        /**
         * Emitted when the client's session becomes invalidated.
         * You are expected to handle closing the process gracefully and preventing a boot loop if you are listening to this event.
         * @event invalidated
         * @returns {Promise<void>}
         */
    }
}