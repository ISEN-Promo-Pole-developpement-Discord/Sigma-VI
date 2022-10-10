const { createChannel, deleteSystemMessages } = require("../utils/channelManager.js");
const { GuildsManager } = require("../bdd/classes/guildsManager.js");
const { UsersManager } = require("../bdd/classes/usersManager.js");
const { IndexedChannelsManager } = require("../bdd/classes/indexedChannelsManager.js");
const {loadModulesCommands} = require("../requests/modules/modulesManager.js");
const { logStart, logEnd } = require("../utils/stdoutLogger.js");

async function initializeGuilds()
{
    return new Promise(async (resolve, reject) => {
        guilds = global.client.guilds.cache;
        for(let guild of guilds.values()){
            logStart("\t<" + guild.name + "> Initialisation : ", 1);
                try{
                    guild = await guild.fetch();
                    const guildDB = await GuildsManager.getGuild(guild.id);
    
                    if (!guildDB) {
                        await GuildsManager.addGuild({id: guild.id, config: "{}" });
                    }
                    await createChannel(guild,null,"bienvenue","Bienvenue").then((channel => { deleteSystemMessages(channel); }));
                    logEnd(true);
                }catch(e){
                    logEnd(false);
                    console.error(e);
                }

            logStart("\t<" + guild.name + "> Chargement des utilisateurs : ",1);
                try{
                    const membersList = client.guilds.cache.get(guild.id);
                    for(const member of membersList.members.cache.values()){
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
                        }
                    }
                    logEnd(true);
                }catch(e){
                    logEnd(false);
                    console.error(e);
                }
        }
        resolve();
    });
}

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        /**
         * Emitted when the client becomes ready to start working.
         * @param {Client} client The client that is ready
         * @event ready
         * @returns {Promise<void>}
         */
        console.log(" ");
        logStart(`>> Intialisation de ${client.user.tag}...`, 1, "\n");
        IndexedChannelsManager.updateAll();

        logStart("> Chargement des serveurs...", 1, "\n");
        await initializeGuilds();
        logStart("> Serveurs chargés", 1, "\n");

        // Load modules commands
        if(global.config.core.modules === true) {
            logStart("> Chargement des modules : ",1);
            try{
                guilds = await client.guilds.fetch();
                await loadModulesCommands();
                logEnd(true);
            }
            catch(e){
                logEnd(false);
                console.error(e);
            }
        }

        logStart(`>> ${client.user.tag} prêt.`, 1, "\n");
        console.log(" ");
    }
}