const {logDelete} = require('../modtools/log/logModules.js');


module.exports = {
    name: "inviteDelete",
    once: false,
    execute(invite) {
        /**
         * Emitted when an invite is deleted.
         * @param {Invite} invite The invite that got deleted
         * @event inviteDelete
         * @returns {Promise<void>}
         */

         logDelete(
            invite.guild,
            "Invite",
            null,
            null,
            invite,
            "admin",
        );
    }
}