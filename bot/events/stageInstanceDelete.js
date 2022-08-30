const {logCreate, logDelete} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

module.exports = {
    name: "stageInstanceDelete",
    once: false,
    execute(stageInstance) {
        /**
         * Triggered when a stage instance gets deleted
         * @param {StageInstance} stageInstance The stage instance that got deleted
         * @returns {Promise<void>}
            */
         getActionAuthor(stageInstance.guild, stageInstance, "StageInstance").then(userAuthor => {
            logDelete(
                stageInstance.guild,
                "Stage Instance",
                userAuthor,
                null,
                stageInstance,
                "admin",
            );
        }
        );
    }
}