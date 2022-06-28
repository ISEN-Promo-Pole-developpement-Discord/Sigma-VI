module.exports = {
    name: "invalidRequestWarning",
    once: false,
    execute(invalidRequestWarningData) {
        /**
         * Emitted periodically when the process sends invalid requests to let users avoid the 10k invalid requests in 10 minutes threshold that causes a ban
         * @param {Object} invalidRequestWarningData The data of the invalid request warning
         * @returns {Promise<void>}
         * @event invalidRequestWarning
         */
    }
}