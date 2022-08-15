const {logUpdate} = require('../modtools/log/logModules.js');

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
    
    logUpdate(
        newMember.guild,
        "GuildMember",
        null,
        newMember,
        oldMember,
        newMember,
        "admin",
    );
    }
}