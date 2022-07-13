const {logDelete} = require('../modtools/log/log-admin.js');

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
         logDelete(
            role.guild,
            "Role",
            null,
            null,
            role,
            "admin",
        )
    }
}