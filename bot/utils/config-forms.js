
function createChannel(guild,user) {
     guild.channels.create(`forms of user : ${user}`,{
        type : "GUILD_TEXT" ,
        topic : "forms for a new user",
        nsfw : false,
        userLimit : 10, //à changer après
        permissionOverwrites : [{
            id : user,
            allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        }
        ],
        position : 1,
        reason : "forms"}
     )

     .then(NewCha => {
       NewCha.send(`bienvenue ! clique sur  : ${NewCha}`);
     })
   .catch(console.error);

}

module.exports = {
    createChannel
}