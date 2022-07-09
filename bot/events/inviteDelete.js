const {logDelete} = require('../modtools/log/log-admin.js');


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
            "Emoji",
            null,
            null,
            invite,
            "admin",
        );
    }
}