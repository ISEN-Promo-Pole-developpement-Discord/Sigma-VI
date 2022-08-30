const { createChannel } = require("../utils/channelManager.js");
const { GuildsManager } = require("../bdd/classes/guildsManager.js");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        /**
         * Emitted when the client becomes ready to start working.
         * @param {Client} client The client that is ready
         * @event ready
         * @returns {Promise<void>}
         */
        console.log(`Le bot ${client.user.tag} est lancé.`);

        client.guilds.fetch().then((guilds) => {
            guilds.forEach(async (guild, snowflake) => {
                guild = await guild.fetch();
                const guildDB = await GuildsManager.getGuild(guild.id);

                if (guildDB) {
                    createChannel(guild,null,"welcome","Welcome");
                }
            });
        });
    }
}