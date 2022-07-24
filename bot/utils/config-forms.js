const { ChannelType } = require("discord.js");

function createChannel(guild,user) {
     guild.channels.create(
      {
        name: `welcome-${user.username}-${user.discriminator}`,
        type: ChannelType.GuildText
      }
     ).then(channel => {
       channel.send(`bienvenue ! clique sur  : ${channel}`);
     })
   .catch(console.error);

}

module.exports = {
    createChannel
}