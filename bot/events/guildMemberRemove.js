module.exports = {
    name: "guildMemberRemove",
    once: false,
    execute(member) {
        /**
         * Emitted whenever a member leaves a guild, or is kicked.
         * @param {GuildMember} member The member that left, or was kicked
         * @event guildMemberRemove
         * @returns {Promise<void>}
         */
    }
}