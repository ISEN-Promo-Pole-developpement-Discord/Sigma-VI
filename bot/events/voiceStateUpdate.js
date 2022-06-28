module.exports = {
    name: "voiceStateUpdate",
    once: false,
    execute(oldVoiceState, newVoiceState) {
        /**
         * Triggered when a voice state gets updated
         * @param {VoiceState} oldVoiceState The voice state object before the update
         * @param {VoiceState} newVoiceState The voice state object after the update
         * @returns {Promise<void>}
         */
    }
}