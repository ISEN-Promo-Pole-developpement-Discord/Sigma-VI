module.exports = {
    name: "presenceUpdate",
    once: false,
    execute(oldPresence, newPresence) {
        /**
         * Emitted whenever a user changes their presence, either by changing their
         * own status or by being added/removed from a voice channel.
         * @param {Presence} oldPresence The presence before the update
         * @param {Presence} newPresence The presence after the update
         * @event presenceUpdate
         * @returns {Promise<void>}
         */
    }
}
