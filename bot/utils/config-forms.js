const { ChannelType } = require("discord.js");
const { getSelectMenuFromJSON } = require('../forms/formManager.js');
const welcomeFormData = require('../forms/welcomeForm/welcomeForm.json');

function createChannel(guild,user,NewChannel,welcomeMsg) {
    if(!NewChannel){
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
       channel.send(`bienvenue sur  le serveur : ${guild}`);
       channel.send({components: getSelectMenuFromJSON(welcomeFormData, null)});
     })
   .catch(console.error);

}
  else{
    let exist=false;
    guild.channels.fetch()
    .then( channels => channels.forEach((entry,snowflake) => {
       if(entry.name){
        if(entry.name===NewChannel){
            exist=true;
            if(typeof entry.lastMessage === null) {
              if(welcomeMsg){ 
              entry.send(welcomeMsg) //message personalisé
              }
              else{
                entry.send(`bienvenue sur  le serveur : ${guild}`); //message de base
              }
            }
         }} }
    ))
    if(exist===false){
      guild.channels.create(
        {
        name: NewChannel,
        type: ChannelType.GuildText,
        } 
       ).then(channel => {
        if(welcomeMsg){
          channel.send(welcomeMsg);
         }
         else{
         channel.send(`bienvenue sur  le serveur : ${guild}`);
         }
         channel.send({components: getSelectMenuFromJSON(welcomeFormData, null)});
       })

    }
  }
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