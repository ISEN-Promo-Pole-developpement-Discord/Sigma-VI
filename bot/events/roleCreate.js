const {logCreate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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

        // FIXME - Update of a role provoke a role creation logs spam (in every case except one)
        // FIXME - Update of a role is considered as a role creation (in logs)
       
        getActionAuthor(role.guild, role, "role").then(userAuthor => {
            logCreate(
                role.guild,
                "role",
                userAuthor,
                role,
                "admin",
            );
        });
    }
}