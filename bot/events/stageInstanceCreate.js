const {logCreate} = require('../modtools/log/log-admin.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

module.exports = {
    name: "stageInstanceCreate",
    once: false,
    execute(stageInstance) {
        /**
         * Triggered when a stage instance gets created
         * @param {StageInstance} stageInstance The stage instance that got created
         * @returns {Promise<void>}
            */
        getActionAuthor(stageInstance.guild, stageInstance, "StageInstance").then(userAuthor => {
            logCreate(
                stageInstance.guild,
                "Stage Instance",
                {
                    username: userAuthor.tag,
                    avatarURL: userAuthor.displayAvatarURL(),
                },
                stageInstance,
                "admin",
            );
        });
    }
}