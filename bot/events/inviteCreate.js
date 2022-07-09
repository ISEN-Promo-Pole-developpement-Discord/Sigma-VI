const {logCreate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "inviteCreate",
    once: false,
    execute(invite) {
        /**
         * Emitted when an invite is created.
         * @param {Invite} invite The invite that got created
         * @event inviteCreate
         * @returns {Promise<void>}
         */
        logCreate(
            invite.guild,
            "Emoji",
            null,
            invite,
            "admin",
        );
    }
}