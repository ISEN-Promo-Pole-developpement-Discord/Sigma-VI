const {IndexedChannelsManager} = require('../bdd/classes/indexedChannelsManager');

module.exports = {
    name: "threadCreate",
    once: false,
    execute(thread, newlyCreated) {
        /**
         * Emitted when a thread is created.
         * @param {Thread} thread The thread that got created
         * @param {boolean} newlyCreated Whether the thread was newly created
         * @event threadCreate
         * @returns {Promise<void>}
            */

        IndexedChannelsManager.updateAll();
    }
}