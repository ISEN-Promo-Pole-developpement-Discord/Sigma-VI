const {deleteChannel,createChannel} = require('../utils/config-forms.js');

module.exports = {
    name: "messageCreate",
    once: false,
    execute(message) {
        /**
         * Emitted whenever a message is created.
         * @param {Message} message The message that got created
         * @event messageCreate
         * @returns {Promise<void>}
         */
        console.log(`Nouveau message par ${message.author.tag}: ${message.content} et en plus l'icon ${message.author.avatarURL()}`);
        console.log(`channel : ${message.channel}`);

        if(message.content.split(` `)[0]==='SigmaDeleteChannel'){
                message.guild.channels.fetch()
                     .then( channels => channels.forEach((entry,snowflake) => {
                        if(entry.name){
                         if(entry.name===message.content.split(` `)[1]){
                             deleteChannel(message.guild,entry.name);
                         }
                }}
                     )
                     )
                     deleteChannel(message.guild,message.channel);
            }

            if(message.content.split(` `)[0]==='SigmaCreateChannel'){
                if(!message.content.split(` `)[1]){
                createChannel(message.guild,message.author);
            }
            else {
                   createChannel(message.guild,message.author,message.content.split(` `)[1]);
                
            }
        }       
        }
    }
