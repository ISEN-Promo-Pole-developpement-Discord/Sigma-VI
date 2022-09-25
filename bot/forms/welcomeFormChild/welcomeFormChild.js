const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require("discord.js");
const { UsersManager } = require("../../bdd/classes/usersManager.js");
const { manageRoles, assignVerifiedRole } = require("../../utils/rolesManager.js");

async function handleVerificationRequest(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const user = await UsersManager.getUser(interaction.user.id);
    if(user){
        if(await user.getStatus() == 0){
            const data = await user.getData();
            if(data && data.filiere){
                await interaction.editReply({content: "Vos informations ont bien été récupérées, vous pouvez désormais accéder au serveur."});
                await assignVerifiedRole(interaction.user, interaction.guild);

                var values = Object.keys(data).map(function(key){
                    return data[key];
                });
                
                await manageRoles(interaction.member, values);
                await user.updateAssociationsServerPermissions();
                
                if(interaction.member.manageable){

                    const name = await user.getName();
                    const surname = await user.getSurname();
                    
                    let displayedName;
                    if (name.includes(" "))
                        displayedName = `${name.split(" ").map((x) => {return x.charAt(0).toUpperCase()}).join("")}`;
                    else if (name.includes("-"))
                        displayedName = `${name.split("-").map((x) => {return x.charAt(0).toUpperCase()}).join("")}`;
                    else
                        displayedName = `${name.charAt(0).toUpperCase()}`;
                    await interaction.member.setNickname(`${surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase()} ${displayedName}.`);
                }

                console.log(`# ${interaction.user.tag} a été vérifié sur le serveur ${interaction.guild.name}.`);
                return;
            }
        }
    }
    interaction.editReply({content: "*Vous n'avez pas encore rempli le formulaire de d'inscription.*\nhttps://discord.gg/vaMYaRd3ns"});
}

module.exports = {
    handleVerificationRequest
}