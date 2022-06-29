const {logAdminDelete} = require('../modtools/log/log-admin.js');

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

         logAdminDelete(
            role.guild,
            `Role "${role.name}" deleted`,
            null,
            null,
            role.name,
            role.id,
            role.createdTimestamp,
            null
        )
    }
}