const {logCreate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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
        //
        getActionAuthor(invite.guild, invite, "invite").then(userAuthor => {
        logCreate(
            invite.guild,
            "invite",
            null,
            invite,
            "admin",
        );
    }
    );
}
}