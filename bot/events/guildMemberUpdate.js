const {logAdminUpdate} = require('../modtools/log/log-admin.js');
module.exports = {
    name: "guildMemberUpdate",
    once: false,
    execute(oldMember, newMember) {
        /**
         * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
         * @param {GuildMember} oldMember The member before the update
         * @param {GuildMember} newMember The member after the update
         * @event guildMemberUpdate
         */
    
    logAdminUpdate(
        newMember.guild,
        "GuildMember",
        {
            username: oldMember.displayName,
            avatarURL: oldMember.displayAvatarURL(),
        },
        {
            username: newMember.displayName,
            avatarURL: newMember.displayAvatarURL(),
        },
        oldMember,
        newMember,
    );
    }
}