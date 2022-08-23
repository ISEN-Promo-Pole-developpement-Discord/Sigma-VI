const { ChannelType } = require("discord.js");
const { getButtonsFromJSON } = require('../forms/formManager.js');
const welcomeFormData = require('../forms/welcomeForm/welcomeForm.json');


//fonction à supprimer(je pense) après le test 
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
            console.log(`Channel déjà existant : NewChannel :${NewChannel}, entry : ${entry.name}`);
            console.log(entry.lastMessage);
            if(entry.lastMessage === null) {
              if(welcomeMsg){ 
              entry.send(welcomeMsg) //message personalisé
              }
              else{
                entry.send(`bienvenue sur  le serveur : ${guild}`); //message de base
              }
            }
         }}
    ));
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
//fonction à supprimer après les tests
function fetchChannels(msgChannel,channelWfetch){
  if(!channelWfetch){
    msgChannel.guild.channels.fetch()
    .then( channels => channels.forEach((entry,snowflake) => {
      if(entry.name){
        msgChannel.send(`Channel in ${msgChannel.guild} : ${entry.name}`);
      }}
      )
    )
}
  else{
    let exist=false;
    msgChannel.guild.channels.fetch()
    .then( channels => channels.forEach((entry,snowflake) => {
      if(entry.name){
        if(entry.name === channelWfetch) {
          msgChannel.send(`le channel : ${channelWfetch} est bien dans le serveur  : ${msgChannel.guild}`);
          exist=true;
          return entry;
        }
      }}
    ))
    if(exist===false){
        msgChannel.send(`Désolé, le channel ${channelWfetch} n'est pas sur le serveur  : ${msgChannel.guild}`);
      return null;
      }
  }
}


function clearChannel(channel) {
  if(!channel){return}
  else{
      channel.messages.fetch()
      .then (message=> message.forEach((entry,snowflake) => {
          channel.messages.delete(entry);
      }
      )
      )

  } 
} 

async function createThread(channel,ThreadName,message){
  console.log(1);
  if(channel) {
    console.log(`\n\n\nCreation of a thread : ${ThreadName}\n\n\n`)
    if(ThreadName){
      const thread = await channel.threads.create({
        name : `Welcome : ${ThreadName}`,
        //startMessage :{components: getButtonsFromJSON(welcomeFormData, null)},
        startMessage: message,
      });

      return thread;
    }
  
  }
}


module.exports = {
    createChannel,
    deleteChannel,
    fetchChannels,
    clearChannel,
    createThread
}