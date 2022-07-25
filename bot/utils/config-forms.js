const { ChannelType } = require("discord.js");
const { getSelectMenuFromJSON } = require('../forms/formManager.js');
const welcomeFormData = require('../forms/welcomeForm/welcomeForm.json');

function createChannel(guild,user) {
     guild.channels.create(
      {
        name: `welcome-${user.username.split(`-`)}-${user.discriminator}`,
        type: ChannelType.GuildText,
        /*permissionOverwrite : {
          id: user.id, 
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'], //Allow permissions
        }*/
      } 
     ).then(channel => {
       channel.send(`bienvenue ! clique sur  le serveur : ${guild}`);
       channel.send({components: getSelectMenuFromJSON(welcomeFormData, null)});
     })
   .catch(console.error);

}

function deleteChannel(guild,channel) {
  if(channel){
  console.log(`\nle channel ${channel} dans le serveur ${guild} vient d'être supp\n`);
  guild.channels.delete(channel);
  }
}
  


module.exports = {
    createChannel,
    deleteChannel
}