module.exports = {
    name: "guildMemberAvailable",
    once: false,
    execute(member) {
        /**
         * Emitted whenever a member becomes available in a large guild.
         * @param {GuildMember} member The member that became available
         * @event guildMemberAvailable
         * @returns {Promise<void>}
         */
    }
}