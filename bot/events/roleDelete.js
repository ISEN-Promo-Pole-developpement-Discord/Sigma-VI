const {logDelete} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');
module.exports = {
    name: "roleDelete",
    once: false,
    execute(role) {
        /**
         * Emitted whenever a role is deleted.
         * @param {Role} role The role that got deleted
         * @event roleDelete
         * @returns {Promise<void>}
        */

         getActionAuthor(role.guild, role, "role").then(userAuthor => {
            logDelete(
                role.guild,
                "Role",
                userAuthor,
                null,
                role,
                "admin",
            )
        });
    }
}