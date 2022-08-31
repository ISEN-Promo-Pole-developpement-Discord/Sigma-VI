const { createChannel, deleteSystemMessages } = require("../utils/channelManager.js");
const { GuildsManager } = require("../bdd/classes/guildsManager.js");
const { UsersManager } = require("../bdd/classes/usersManager.js");

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

                if (global.debug) console.log("> Chargement des serveurs...");
                guild = await guild.fetch();
                const guildDB = await GuildsManager.getGuild(guild.id);

                if (!guildDB) {
                    await GuildsManager.addGuild({id: guild.id, config: "{}" });
                }
                createChannel(guild,null,"bienvenue","Bienvenue").then((channel => { deleteSystemMessages(channel); }));

                if (global.debug) console.log("> Chargement des utilisateurs...");
                const membersList = client.guilds.cache.get(guild.id);
                membersList.members.cache.forEach( async (member) => {
                    if (await UsersManager.getUser(member.id) === null  && !member.user.bot) {
                        await UsersManager.addUser({
                            id: member.id,
                            name: null,
                            surname: null,
                            email: null,
                            password: null,
                            status: -1,
                            data: "{}"
                        });
                    }});
                if (global.debug) console.log("> Chargements finis.");
            });
        });
    }
}