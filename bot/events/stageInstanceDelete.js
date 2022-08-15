const {logCreate} = require('../modtools/log/logModules.js');
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
         getActionAuthor(invite.guild, invite, "invite").then(userAuthor => {
            logCreate(
                invite.guild,
                "invite",
                userAuthor,
                invite,
                "admin",
            );
        }
        );
    }
}