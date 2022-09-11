const Discord = require('discord.js');


class IndexedChannel {
    constructor(channel_id, guild_id){
        this.channel_id = channel_id;
        this.guild_id = guild_id;
    }

    async getChannel(){
        const channel = await global.client.channels.fetch(this.channel_id);
        return channel;
    }

    async getGuild(){
        const guild = await global.client.guilds.fetch(this.guild_id);
        return guild;
    }

    async getIndexText(){
        const connection = global.sqlConnection;
        const [rows] = await connection("SELECT indexMessage FROM indexed_channel WHERE channel_id = ?", [this.channel_id]);
        return rows.indexMessage;
    }

    async getMessage(){
        const indexMessage = await this.getIndexText();
        const channel = await this.getChannel();
        var message = null;
        var messages = await channel.messages.fetch({limit: 100});
        if(messages){
            for(var msg of messages.values()){
                if(msg.content === indexMessage){
                    message = msg;
                    break;
                }
            }
        }
        return message;
    }

    async getThreads(){
        const channel = await this.getChannel();
        await channel.threads.fetch();
        var threads = [];
        for(var thread of channel.threads.cache.values()){
            threads.push(thread);
        }
        return threads;
    }

    async update(){
        const threads = await this.getThreads();
        const message = await this.getMessage();
        const channel = await this.getChannel();
        var indexMessage = await this.getIndexText();
        
        var targetMessage = {content: indexMessage, embeds: []};
        for(var thread of threads){
            if(thread.archived && thread.unarchivable){
                await thread.setArchived(false);
            }
            var threadMessages = await thread.messages.fetch({limit: 100});
            var threadFirstMessage = threadMessages.first();
            var content = threadFirstMessage.content;
            var embed = new
            Discord.EmbedBuilder()
            .setTitle(thread.name)
            .setURL(thread.url);
            if(content){
                content = content.substring(0, 1000);
                content = content.split("\n")[0];
                embed.setDescription(content);
            }
            targetMessage.embeds.push(embed);
        }
        if(message){
            await message.edit(targetMessage);
        } else {
            await channel.send(targetMessage);
        }
    }
}

module.exports = { IndexedChannel };