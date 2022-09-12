const {IndexedChannelsManager} = require('../bdd/classes/indexedChannelsManager');

module.exports = {
    name: "threadUpdate",
    once: false,
    execute(oldThread, newThread) {
        /**
         * Emitted when a thread is updated.
         * @param {Thread} oldThread The thread before it was updated
         * @param {Thread} newThread The thread after it was updated
         * @event threadUpdate
         * @returns {Promise<void>}
         */

        IndexedChannelsManager.updateAll();
    }
}