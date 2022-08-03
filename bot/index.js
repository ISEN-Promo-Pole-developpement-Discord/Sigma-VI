const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const { debug } = require('./config-core.json');
const { initBdd } = require("./bdd/utilsDB");
const fs = require("node:fs");
const path = require("node:path");

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
global.client = client;

// Load all events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

console.log("Chargement des évènements...");
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}
console.log("Évènements chargés.");

initBdd();

client.login(token);