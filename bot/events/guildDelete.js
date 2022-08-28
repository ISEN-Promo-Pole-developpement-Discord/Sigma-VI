const { GuildsManager } = require("../bdd/classes/guildsManager");

module.exports = {
    name: "guildDelete",
    once: false,
    async execute(guild) {
        /**
         * Triggered when a user kicks/bans the bot from his server
         * @param {Guild} guild The guild the bot got kicked/banned from
         * @event guildDelete
         * @returns {Promise<void>}
         */

        const isGuildExist = await GuildsManager.getGuild(guild.id);
        if (isGuildExist !== null)
            await GuildsManager.deleteGuild(guild.id);
    }
}