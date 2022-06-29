const {logAdminCreate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "roleCreate",
    once: false,
    execute(role) {
        /**
         * Emitted whenever a role is created.
         * @param {Role} role The role that got created
         * @event roleCreate
         * @returns {Promise<void>}
            */

        logAdminCreate(
            role.guild,
            `Role "${role.name}" created`,
            null,
            null,
            role.name,
            role.id,
            role.createdTimestamp,
            `<@&${role.id}>`,
            null
        )
    }
}