const { ChannelType, ActionRowBuilder, GuildPremiumTier, ButtonBuilder, ButtonStyle, MessageType} = require("discord.js");
const { getButtonsFromJSON } = require('./formHelper.js');
const welcomeFormData = require('../forms/welcomeForm/welcomeForm.json');

//fonction à supprimer(je pense) après le test 
async function createChannel(guild, user, NewChannel, Ntryparent) {
  const channels = await guild.channels.fetch();
  let channel;

  channels.forEach((entry, snowflake) => {
    if (entry.name === NewChannel) {
      NewChannel = entry;
    }
  }
  )
  
  var channelMessageContent;

  if(guild.id === global.config.core.mainGuildId){
    channelMessageContent = {
      content: `**Bienvenue sur le serveur discord de l'ISEN Méditerranée !**\n*Sigma, à votre service.*\nAvant de nous rejoindre, j'ai quelques questions à vous poser.\n\n***Pour commencer, sélectionnez un profil ici :arrow_heading_down:***`,
      components: getButtonsFromJSON(welcomeFormData)
    };
  }else{
    var actionRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('form_externalVerificationWelcome')
        .setLabel('Connexion')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel('ISEN Méditerranée')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/vaMYaRd3ns')
    );
    channelMessageContent = {
      content: `**Bienvenue sur le serveur discord "${guild.name}"**\n*Sigma, à votre service.*\n\n***Pour rejoindre le serveur, inscrivez-vous sur le serveur de l'ISEN méditérannée et connectez-vous.***`,
      components: [actionRow]
    };
  }
  
  if (typeof (NewChannel) === `string`) {
    channel = await guild.channels.create(
      {
        name: NewChannel,
        type: ChannelType.GuildText,
      });


    channel.send(channelMessageContent);

    if (Ntryparent) {
      guild.channels.fetch()
        .then(channels => channels.forEach((entry, snowflake) => {
          if (entry.name) {
            if (entry.name === Ntryparent) {
              channel.setParent(entry);
            }
          }
        })
        )
    }
  }
  else {
    channel = NewChannel;
    const messages = await NewChannel.messages.fetch()
    if (messages.size === 0) NewChannel.send(channelMessageContent);
  }
  return channel;
}

async function createThread(channel, ThreadName, message, userlist) {
  if (channel) {
    const tier = channel.guild.premiumTier;

    let channelType;
    if (tier >= GuildPremiumTier.Tier2) {
      channelType = ChannelType.GuildPrivateThread;
    } else {
      channelType = ChannelType.GuildPublicThread;
    }
    if (ThreadName) {
      const thread = await channel.threads.create({
        name: ThreadName,
        startMessage: message,
        type: channelType,
      });
      for (let i = 0; i < userlist.length; i++) {
        await thread.members.add(userlist[i]);
      }
      return thread;
    }
  }
}

async function deleteSystemMessages(channel) {
  let messagesPending = [];
  const messages = await channel.messages.fetch();
  messages.forEach((msg, snowflake) => {
    if (msg.type === MessageType.ThreadCreated){
        messagesPending.push(msg.delete());
    }
  });

  await Promise.all(messagesPending);
}


module.exports = {
  createChannel,
  createThread,
  deleteSystemMessages
}