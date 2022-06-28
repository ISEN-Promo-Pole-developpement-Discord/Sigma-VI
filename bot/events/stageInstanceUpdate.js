module.exports = {
    name: "stageInstanceUpdate",
    once: false,
    execute(oldStageInstance, newStageInstance) {
        /**
         * Emitted when a stage instance is updated.
         * @param {StageInstance} oldStageInstance The stage instance before it was updated
         * @param {StageInstance} newStageInstance The stage instance after it was updated
         * @event stageInstanceUpdate
         * @returns {Promise<void>}
            */
    }
}