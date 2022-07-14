const {logCreate} = require('../modtools/log/log-admin.js');
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
         getActionAuthor(oldStageInstance.guild, oldStageInstance, "invite").then(userAuthor => {
            logCreate(
                invite.guild,
                "invite",
                {
                    username: userAuthor.tag,
                    avatarURL: userAuthor.displayAvatarURL(),
                },
                null,
                invite,
                "admin",
            );
        }
        );
    }
}