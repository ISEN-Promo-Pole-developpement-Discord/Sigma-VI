const { GuildMember } = require('discord.js');
const {logUpdate} = require('../modtools/log/logModules.js');
const {getActionAuthor} = require('../modtools/log/logger.js');

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
    //getActionAuthor(newMember.guild, newMember, "member").then(userAuthor => {
    logUpdate(
        newMember.guild,
        "GuildMember",
        oldMember.user,
        null,
        oldMember,
        newMember,
        "admin",
        );
        //});
    }
}