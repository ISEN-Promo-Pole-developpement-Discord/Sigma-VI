const { IndexedChannel} = require('./indexedChannel');

/**
 * IndexedChannelsManager class
 * @class
 * @static
 * @deprecated Channel indexation is now obsolete due to forums addition
 */
class IndexedChannelsManager {
    static async getIndexedChannels(){
        const connection = global.sqlConnection;
        const rows = await connection("SELECT * FROM indexed_channel");
        var indexedChannels = [];
        for(var row of rows){
            var indexedChannel = new IndexedChannel(row.channel_id, row.guild_id);
            if(indexedChannel){
                let channel = await indexedChannel.getChannel();
                if(channel) indexedChannels.push(indexedChannel);
                else await this.removeIndexedChannel(row.channel_id);
            }
        }
        return indexedChannels;
    }

    static async getIndexedChannel(channel_id){
        const connection = global.sqlConnection;
        const [rows] = await connection("SELECT * FROM indexed_channel WHERE channel_id = ?", [channel_id]);
        var indexedChannel = null;
        if(rows && rows.length > 0){
            indexedChannel = new IndexedChannel(rows[0].channel_id, rows[0].guild_id);
            let channel = await indexedChannel.getChannel();
            if(!channel){
                await this.removeIndexedChannel(channel_id);
                indexedChannel = null;
            }
        }
        return indexedChannel;
    }

    static async addIndexedChannel(channel_id, guild_id, indexMessage){
        var indexedChannel = await this.getIndexedChannel(channel_id);
        if(indexedChannel){
            await indexedChannel.update();
            return false;
        }
        const connection = global.sqlConnection;
        await connection("INSERT INTO indexed_channel (channel_id, guild_id, indexMessage) VALUES (?, ?, ?)", [channel_id, guild_id, indexMessage]);
        indexedChannel = new IndexedChannel(channel_id, guild_id);
        await indexedChannel.update();
        return indexedChannel;
    }

    static async removeIndexedChannel(channel_id){
        const connection = global.sqlConnection;
        await connection("DELETE FROM indexed_channel WHERE channel_id = ?", [channel_id]);
    }

    static async updateAll(){
        const indexedChannels = await this.getIndexedChannels();
        for(var indexedChannel of indexedChannels){
            await indexedChannel.update();
        }
    }
}

module.exports = { IndexedChannelsManager };