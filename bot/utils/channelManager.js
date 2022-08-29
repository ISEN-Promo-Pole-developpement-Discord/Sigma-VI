const { ChannelType, WelcomeChannel, GuildScheduledEvent } = require("discord.js");
const { getButtonsFromJSON } = require('./formHelper.js');
const welcomeFormData = require('../forms/welcomeForm/welcomeForm.json');

//fonction à supprimer(je pense) après le test 
async function createChannel(guild,user,NewChannel,Ntryparent) {
  await guild.channels.fetch()
  .then( channels => channels.forEach((entry,snowflake) => {
      if(entry.name===NewChannel){
          NewChannel=entry;
          console.log(`NewChannel find ${NewChannel}`);
      }
    }
  )
  )
  if(typeof(NewChannel)===`string`){
  guild.channels.create(
        {
         name: NewChannel,
        type: ChannelType.GuildText,
        } 
       ).then(channel => {
        channel.send({ content :(`bienvenue sur  le serveur : ${guild}`),components: getButtonsFromJSON(welcomeFormData)});
        if(Ntryparent){
          guild.channels.fetch()
          .then( channels => channels.forEach((entry,snowflake) => {
            if(entry.name){
              if(entry.name === Ntryparent) {
                channel.setParent(entry);
        }}})
        )
        }
      })
      }
  else{
      console.log(`aohoahoa`);
      NewChannel.messages.fetch().then(
        messages => {
          if(messages.size === 0 ){
            NewChannel.send({ content :(`bienvenue sur  le serveur : ${guild}`),components: getButtonsFromJSON(welcomeFormData)});
          }
        }
      )
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


function terminatorChannels(guild,name){
    guild.channels.fetch()
    .then(channels => channels.forEach((entry,snowflake) => {
      if(entry.name){
        if(entry.name.split(`-`)[0]===name){
          guild.channels.delete(entry);
        }
      }}
      )
    )

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

  async function createThread(channel,ThreadName,message,userlist){
   if(channel) {
    if(ThreadName){
      const thread = await channel.threads.create({
        name : ThreadName ,
        startMessage: message,
        type : ChannelType.GuildPrivateThread,
      });
      for (let i = 0; i < userlist.length; i++) {
        thread.members.add(userlist[i]);
      }
      return thread;
    }
  }
}


module.exports = {
    createChannel,
    deleteChannel,
    fetchChannels,
    clearChannel,
    createThread,
    terminatorChannels,
}