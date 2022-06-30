const {logAdminUpdate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "roleUpdate",
    once: false,
    execute(oldRole, newRole) {
        /**
         * Emitted when a role is updated.
         * @param {Role} oldRole The role before it was updated
         * @param {Role} newRole The role after it was updated
         * @event roleUpdate
         * @returns {Promise<void>}
        */

        logAdminUpdate(
            oldRole.guild,
            `Role "${oldRole.name}" updated`,
            null,
            null,
            [{name:"ID", value:oldRole.id, inline:true}, {name:"Creation", value:`<t:${Math.floor(newEmoji.createdTimestamp/1000)}:f>`, inline:true}],
            oldRole.name,
            newRole.name,
        );
    }
}