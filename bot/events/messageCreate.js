const { launchRequestProcessing } = require('../requests/requestManager.js');
const {ResetManager} = require("../bdd/classes/resetManager");
const {IndexedChannelsManager} = require("../bdd/classes/indexedChannelsManager");
const {ChannelType} = require("discord.js");
const CORE = require("../requests/modules/train/core.js");

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        /**
         * Emitted whenever a message is created.
         * @param {Message} message The message that got created
         * @event messageCreate
         * @returns {Promise<void>}
         */
         if (message.author.bot) return;
        if (!message.content) return;

        if(global.config.core.modules === true){
            launchRequestProcessing(message, global.client);
        }

        if(message.channel.type === ChannelType.DM) return;
        if(message.content.startsWith("?index")){
            const user_id = message.author.id;
            const content = message.content.slice(7);
            if(user_id === "138323359501910016"){
                const channel_id = message.channel.id;
                const guild_id = message.guild.id;
                await IndexedChannelsManager.addIndexedChannel(channel_id, guild_id, content);
            }
        }
    }
}
