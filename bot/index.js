const {getConfig, getConfigCore} = require("./config-manager.js");
global.config = getConfig();
if(!global.config) throw new Error("No config found");
global.config.core = getConfigCore();
if(!global.config.core) throw new Error("No config core found");

const { Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const { debug } = require('./config-core.json');
const { initBdd } = require("./bdd/utilsDB");
const fs = require("node:fs");
const path = require("node:path");
const {loadModulesCommands} = require("./requests/modules/modulesManager.js");
const {UsersManager} = require("./bdd/classes/usersManager.js");

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

// Load all events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
(async () => {
    console.log("> Chargement des évènements...");
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    }

    console.log("> Connection à la base de données...");
    await initBdd();

    console.log("> Connection à Discord...");
    await client.login(global.config.token);
    global.client = client;
    global.client.commands = new Collection();

    if(global.config.core.modules === true) {
        console.log("> Chargement des modules...");
        guilds = await client.guilds.fetch();
        loadModulesCommands();
    }
})();
