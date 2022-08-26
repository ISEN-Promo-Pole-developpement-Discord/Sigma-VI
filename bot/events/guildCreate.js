const { GuildsManager } = require("../bdd/classes/guildsManager");

module.exports = {
    name: "guildCreate",
    once: false,
    async execute(guild) {
        /**
         * Triggered when a user invites the bot onto his server
         * @param {Guild} guild The guild the bot got invited to
         * @event guildCreate
         * @returns {Promise<void>}
         */

        const isGuildExist = await GuildsManager.getGuild(guild.id);
        if (isGuildExist === null) {
            await GuildsManager.addGuild({id: guild.id, config: "{}"});
        }
    }
}