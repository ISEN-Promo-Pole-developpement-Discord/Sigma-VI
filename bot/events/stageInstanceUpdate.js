const {logCreate, logUpdate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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
         getActionAuthor(oldStageInstance.guild, oldStageInstance, "stageInstance").then(userAuthor => {
            logUpdate(
                newStageInstance.guild,
                "Stage Instance",
                userAuthor,
                null,
                oldStageInstance,
                newStageInstance,
                "admin",
            );
        }
        );
    }
}