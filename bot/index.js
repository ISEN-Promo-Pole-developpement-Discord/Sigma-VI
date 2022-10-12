
// Load config files
const {getConfig, getConfigCore} = require("./config-manager.js");
global.config = getConfig();
if(!global.config) throw new Error("No config found");
global.config.core = getConfigCore();
if(!global.config.core) throw new Error("No config core found");

// Load libraries
const { Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const { debug } = require('./config-core.json');
const { initializeDatabase } = require("./bdd/utilsDB");
const fs = require("node:fs");
const path = require("node:path");
const {UsersManager} = require("./bdd/classes/usersManager.js");
const {logStart, logEnd} = require("./utils/stdoutLogger.js");

// Create a new Discord client
const clientIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent
];

const clientPartials = [
    Partials.Channel
]

const client = new Client({ intents: clientIntents, partials: clientPartials });
global.debug = debug;

// Events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

(async () => {
    // Load events
    logStart("> Chargement des évènements : ");
        try{
            for (const file of eventFiles) {
                const filePath = path.join(eventsPath, file);
                const event = require(filePath);
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                } else {
                    client.on(event.name, (...args) => event.execute(...args))
                }
            }
        }catch(e){
            logEnd(false);
            console.log(e);
            throw e;
        }
    logEnd(true);

    // Connect and update database
    await initializeDatabase();

    // Connect to Discord API
    logStart("> Connexion à l'API Discord : ");
        try{
            await client.login(global.config.token);
            global.client = client;
            global.client.commands = new Collection();
        }catch(e){
            logEnd(false);
            console.log(e);
            throw e;
        }
    logEnd(true);
})();
