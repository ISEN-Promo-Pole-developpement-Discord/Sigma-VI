const { ChannelType } = require("discord.js");
const { getButtonsFromJSON } = require('../forms/formManager.js');
const welcomeFormData = require('../forms/welcomeForm/welcomeForm.json');



function createChannel(guild,user,NewChannel,welcomeMsg) {
  //Création d'un channel "de base"
  if(!(NewChannel)){
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
      if(welcomeMsg){
       channel.send({ content :(welcomeMsg),components: getButtonsFromJSON(welcomeFormData, null)});
     }
     else{
      channel.send({ content :(`bienvenue sur  le serveur : ${guild}`),components: getButtonsFromJSON(welcomeFormData, null)});
     }
    })
  }
//création d'un channel personalisé
  else{
    let exist=false;
    guild.channels.fetch()
    .then(channels => channels.forEach((entry,snowflake) => {
        if(entry.name==NewChannel){
            exist=true;
            if(typeof entry.lastMessage === null) {
              if(welcomeMsg){ 
              entry.send(welcomeMsg) //message personalisé
              }
              else{
                entry.send(`bienvenue sur  le serveur : ${guild}`); //message de base
              }
            }
         }}
    ))
    if(exist===false){
      guild.channels.create(
        {
        name: NewChannel,
        type: ChannelType.GuildText,
        } 
       ).then(channel => {
        if(welcomeMsg){
          channel.send({content :welcomeMsg, components: getButtonsFromJSON(welcomeFormData, null)});
         }
         else{
          channel.send({content :`bienvenue sur  le serveur : ${guild}`, components: getButtonsFromJSON(welcomeFormData, null)})
         } 
       })
    }
  }
}

function deleteChannel(guild,channel) {
  if(channel){
  guild.channels.delete(channel);
  }
}
  


module.exports = {
    createChannel,
    deleteChannel
}