module.exports = {
    name: "error",
    once: false,
    execute(error) {
        /**
         * Triggered when an error occured
         * @param {Error} error The error that occured
         * @event error
         * @returns {Promise<void>}
         */
    }
}