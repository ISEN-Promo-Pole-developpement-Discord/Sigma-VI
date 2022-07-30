const {deleteChannel,createChannel,fetchChannels,clearChannel} = require('../utils/config-forms.js');

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

        //Commande SigmaDeleteChannel :
        if(message.content.split(` `)[0].toLowerCase()==='sigmadeletechannel'){
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
            //Commande SigmaCreateChannel :  
            if(message.content.split(` `)[0].toLowerCase()==='sigmacreatechannel'){
                if(!message.content.split(` `)[1]){
                createChannel(message.guild,message.author);
            }
            else {
                   createChannel(message.guild,message.author,message.content.split(` `)[1]);
                
            }
        }       
        //Commande SigmaFetchChannel :
        if(message.content.split(` `)[0].toLowerCase()==='sigmafetchchannel'){
            if(!message.content.split(` `)[1]){
                fetchChannels(message.channel);
            }
            else{
                fetchChannels(message.channel,message.content.split(` `)[1]);
            }

        }
        
        //Commande SigmaClearChannel :
        if(message.content.split(` `)[0].toLowerCase()==='sigmaclearchannel'){
            clearChannel(message.channel)
        }
    }
    }