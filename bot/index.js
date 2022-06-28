const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const fs = require("node:fs");
const path = require("node:path");

const clientIntents = new Intents();
clientIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES);

const client = new Client({ intents: clientIntents });

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(token);
