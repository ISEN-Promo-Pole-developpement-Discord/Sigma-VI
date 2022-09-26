const { AssociationsManager } = require('../../bdd/classes/associationsManager');
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");

async function joinAssociationForm(interaction){
    await interaction.deferReply({ephemeral: true});
    const customId = interaction.customId;
    const guild = interaction.guild;
    const message = interaction.message;
    const args = customId.split("_");
    const positiveAwnser = customId.includes("accept");
    const memberId = args[2];
    const member = guild.members.cache.get(memberId);
    const associationId = args[3];
    const association = await AssociationsManager.getAssociationByID(associationId);

    if(!association){
        console.log("Association not found"+associationId);
        interaction.editReply({content: "Une erreur est survenue, veuillez réessayer", ephemeral: true});
        return;
    }

    let disabledComponents = [];
    let actionRow = new ActionRowBuilder();
    for(component of message.components){
        for(button of component.components){
            let newButton = new ButtonBuilder();
            newButton.setCustomId(button.customId);
            newButton.setLabel(button.label);
            newButton.setStyle(button.style);
            newButton.setDisabled(true);
            actionRow.addComponents(newButton);
        }
    }
    disabledComponents.push(actionRow);

    let messageEmbed = message.embeds[0];
    let updatedEmbed = new EmbedBuilder();
    updatedEmbed.setTitle(messageEmbed.title);
    updatedEmbed.setDescription(messageEmbed.description);
    updatedEmbed.setFields(messageEmbed.fields);

    if(association){
        var promises = [];
        if(positiveAwnser){
            if(await association.addMember(member.id)){
                promises.push(member.send({embeds: [new EmbedBuilder().setTitle("Demande d'adhésion acceptée").setDescription("Votre demande d'adhésion à l'association " + await association.getName() + " a été acceptée.").setColor(0x4ee446)]}));
                promises.push(interaction.editReply({content: "La demande d'adhésion a été acceptée.", ephemeral: true}));
                updatedEmbed.setColor(0x4ee446);
                updatedEmbed.setFooter({
                    text: "Demande acceptée par " + interaction.user.username,
                    icon_url: interaction.user.avatarURL()
                });
                promises.push(message.edit({embeds: [updatedEmbed], components: disabledComponents}));
            }else{
                promises.push(interaction.editReply({content: "Une erreur est survenue, veuillez réessayer", ephemeral: true}));
            }
        }else{
            promises.push(member.send({embeds: [new EmbedBuilder().setTitle("Demande d'adhésion refusée").setDescription("Votre demande d'adhésion à l'association " + await association.getName() + " a été refusée.").setColor(0xf44336)]}));
            promises.push(interaction.editReply({content: "La demande d'adhésion a été refusée.", ephemeral: true}));
            updatedEmbed.setColor(0xf44336);
            updatedEmbed.setFooter({
                text: "Demande refusée par " + interaction.user.username,
                icon_url: interaction.user.avatarURL()
            });
            promises.push(message.edit({embeds: [updatedEmbed], components: disabledComponents}));
        }
        await Promise.all(promises);
    }
}

module.exports = {
    joinAssociationForm
}