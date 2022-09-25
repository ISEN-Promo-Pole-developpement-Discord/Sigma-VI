const { UsersManager } = require("../bdd/classes/usersManager");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { AssociationsManager } = require("../bdd/classes/associationsManager");

async function sendJoinRequest(member, associationID)
{
    let association = await AssociationsManager.getAssociationByID(associationID);
    if (association === null) return false;
    let respoChannels = await association.getRespoChannels();
    let respoChannel = respoChannels[0];
    if (respoChannel === undefined){
        console.log("#ERR : No respo channel found for association " + association.name);
        return false;
    }
    let user = await UsersManager.getUser(member.id);
    let lastRespoMessage = await respoChannel.messages.fetch({limit: 1});
    if(lastRespoMessage.size > 0){
        lastRespoMessage = lastRespoMessage.first();
        if(lastRespoMessage.author.id === client.user.id){
            components = lastRespoMessage.components;
            if(components.length > 0){
                components = components[0].components;
                let button = components.find(button => button.customId.includes("acceptJoinRequest"));
                if(button !== undefined){
                    if(button.disabled === false){
                        return false;
                    }
                }
            }
        }
    }
    if(respoChannel && user){
        let message = await respoChannel.send(
            {embeds:
                [new EmbedBuilder()
                    .setTitle("Demande d'adhésion")
                    .setDescription("Un utilisateur souhaite rejoindre votre association.")
                    .addFields(
                        {name:"Utilisateur", value: member.toString()},
                        {name:"Nom", value: await user.getName() + " " + await user.getSurname()}
                    )
                ], 
            components:
                [
                    new ActionRowBuilder()
                    .addComponents(
                        [
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Accepter")
                            .setCustomId("asso_acceptJoinRequest_" + member.id + "_" + associationID)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("Refuser")
                            .setCustomId("asso_refuseJoinRequest_" + member.id + "_" + associationID)
                            .setDisabled(false)
                        ]
                    )
                ]
            }
        );
        return true;
    }
}

// async function handleAssoInteractionFormResponse(interaction){
//
// }

module.exports = {
    sendJoinRequest
}