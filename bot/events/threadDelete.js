module.exports = {
    name: "threadDelete",
    once: false,
    execute(thread) {
        /**
         * Emitted when a thread is deleted.
         * @param {Thread} thread The thread that got deleted
         * @event threadDelete
         * @returns {Promise<void>}
            */
    }
}