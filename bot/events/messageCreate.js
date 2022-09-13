const { launchRequestProcessing } = require('../requests/requestManager.js');
const {ResetManager} = require("../bdd/classes/resetManager");
const {IndexedChannelsManager} = require("../bdd/classes/indexedChannelsManager");
const {ChannelType} = require("discord.js");

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
        if(message.channel.type === ChannelType.DM) return;
        if (message.author.bot) return;
        if (!message.content) return;

        if(message.content.startsWith("?reset")){
            const user_id = message.author.id;
            if(user_id === "138323359501910016"){
                arg = message.content.split(" ")[1];
                let n = parseInt(arg);
                const members = await message.guild.members.fetch();
                let reseted = 0;
                if(!isNaN(n)){
                    for(let i = 0; i < n; i++){
                        if(reseted >= n) break;
                        for(let member of members.values()){
                            if(reseted >= n) break;
                            if(!member || !member.user) continue;
                            if(member.user.bot) continue;
                            if(member.user.id === "138323359501910016") continue;
                            if(await ResetManager.isUserInResetTable(member.user.id)) continue;
                            ResetManager.addUserToResetTable(member.user.id);
                            //remove all roles
                            let roles = await member.roles.cache;
                            await member.roles.remove(roles);

                            console.log(`>> [RESET] ${member.user.tag} a été réinitialiser.`);
                            reseted++;
                            //wait for 50ms
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                }
                console.log(`>> [RESET] ${reseted} utilisateurs ont été réinitialisés.`);
                message.reply(`${reseted} utilisateurs ont été réinitialisés.`);
            }
        }
        if(message.content.startsWith("?index")){
            const user_id = message.author.id;
            const content = message.content.slice(7);
            if(user_id === "138323359501910016"){
                const channel_id = message.channel.id;
                const guild_id = message.guild.id;
                await IndexedChannelsManager.addIndexedChannel(channel_id, guild_id, content);
            }
        }
        if(global.config.core.modules === true){
            launchRequestProcessing(message, global.client);
        }
    }
}
