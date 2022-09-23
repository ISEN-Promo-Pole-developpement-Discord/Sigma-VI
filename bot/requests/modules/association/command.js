const { SlashCommandBuilder, UserManager} = require('discord.js');
const { AssociationsManager } = require('../../../bdd/classes/associationsManager.js');
const { sendJoinRequest } = require("../../../utils/associationJoinRequest");
const { UsersManager } = require("../../../bdd/classes/usersManager");

async function getExistingAssociationsChoices(){
    let associations = await AssociationsManager.getAllAssociations();
    let choices = [];
    for (let association of associations){
        choices.push({name: await association.getName(), value: association.id.toString()});
    }
    return choices;
}

var SlashCommand = new Promise(async (resolve, reject) => {
    var choicesAssos = await getExistingAssociationsChoices();
    SlashCommand = new SlashCommandBuilder()
    .setName('asso')
    .setDescription("Permet de gérer les associations")
    .addSubcommand(subcommand =>
        subcommand
        .setName('list')
        .setDescription('Liste les associations')
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('join')
        .setDescription('Rejoindre une association')
        .addStringOption(option =>
            option.setName('association')
            .setDescription('L\'association à rejoindre')
            .setRequired(true)
            .addChoices(...choicesAssos)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('leave')
        .setDescription('Quitter une association')
        .addStringOption(option =>
            option.setName('association')
            .setDescription('L\'association à quitter')
            .setRequired(true)
            .addChoices(...choicesAssos)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('kick')
        .setDescription('Expulser quelqu\'un d\'une association')
        .addMentionableOption(option =>
            option.setName('membre')
            .setDescription('Membre de l\'association à expulser')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('association')
            .setDescription('L\'association du membre')
            .setRequired(true)
            .addChoices(...choicesAssos)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('setrole')
        .setDescription('Permet de gérer le rôle d\'un membre')
        .addMentionableOption(option => option.setName('membre').setDescription('Membre de l\'association').setRequired(true))
        .addStringOption(option => option.setName('association').setDescription('Association du membre').setRequired(true).addChoices(...choicesAssos))
        .addStringOption(option => option.setName('role').setDescription('Rôle du membre').addChoices(
            {name : "Membre", value : "member"},
            {name : "Responsable", value : "responsable"},
            {name : "Trésorier", value : "tresorier"},
            {name : "Vice-Président", value : "vicepresident"},
            {name : "Président", value : "president"}
        ).setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('update')
        .setDescription('Mise à jour des rôles associatifs d\'un membre')
        .addMentionableOption(option =>
            option.setName('membre')
            .setDescription('Membre dont les rôles doivent être mis à jour')
            .setRequired(true)
        )
    );
    resolve(SlashCommand);
});

// async function getSlashCommand(){
//
// }

module.exports = {
    data: SlashCommand,
    async execute(interaction){
        var defering = interaction.deferReply({ephemeral : true});
        var subcommand = interaction.options.getSubcommand();
        var author = interaction.member;
        var authorUserObject = await UsersManager.getUser(author.id);
        var reply = null;

        switch(subcommand){
            case 'list':
                let associations = await AssociationsManager.getAllAssociations();
                reply = "**Associations actuellement supportées :**\n";
                if (associations !== null)
                {
                    for(let asso of associations){
                        let name = await asso.getName();
                        reply += "• " + name + "\n";
                    }
                }
                break;

            case 'join':
                var targetAssociation = interaction.options.getString('association');
                var association = await AssociationsManager.getAssociationByID(targetAssociation);
                if(!association) {
                    reply = "L'association " + targetAssociation + " n'existe pas.";
                    break;
                }
                if ((await UsersManager.getUser(author.id)) === null) {
                    reply = "Votre profil n'a pas été trouvé en base de données.";
                    break;
                }
                if ((await authorUserObject.getAssociationRole(targetAssociation)) !== null)
                {
                    reply = "Vous êtes déjà membre de cette association.";
                    break;
                }
                if (await sendJoinRequest(author, association.id))
                    reply = "**Votre demande a bien été prise en compte.**\n*Vous serez notifié lorsque votre demande aura été traitée.*";
                else
                    reply = "Une erreur est survenue lors de l'envoi de votre demande.";
                break;

            case 'leave':
                var targetAssociation = interaction.options.getString('association');
                var association = await AssociationsManager.getAssociationByID(targetAssociation);
                if(!association) {
                    reply = "L'association " + targetAssociation + " n'existe pas.";
                    break;
                }
                if ((await UsersManager.getUser(author.id)) === null) {
                    reply = "Votre profil n'a pas été trouvé en base de données.";
                    break;
                }
                if((await authorUserObject.getAssociationRole(association.id)) === null){
                    reply = "Vous n'êtes pas dans l'association " + await association.getName() + ".";
                    break;
                }
                await association.removeMember(member);

                reply = "**Vous avez bien quitté l'association " + await association.getName() + "**";
                break;

            case 'kick':
                var targetAssociation = interaction.options.getString('association');
                var association = await AssociationsManager.getAssociationByID(targetAssociation);
                var memberMention = interaction.options.getMentionable('membre');
                var targetMember = await UsersManager.getUser(memberMention.id);
                if (!association) {
                    reply = "L'association " + targetAssociation + " n'existe pas.";
                    break;
                }
                if (targetMember === null) {
                    console.log(targetMember);
                    reply = "Le membre " + memberMention.user.username + " n'a pas été trouvé en base de données.";
                    break;
                }
                if((await authorUserObject.getAssociationRole(association.id)) === null){
                    reply = "Le membre " + targetMember.user.username + " n'est pas dans l'association " + await association.getName() + ".";
                    break;
                }
                // Need to add a check to see if the author is a moderator or not
                if((await (await authorUserObject.getAssociationRole(association.id)) < 1) && (!author.permissions.has("MANAGE_ROLES")))
                {
                    reply = "Vous n'avez pas la permission de faire cela car vous n'êtes pas un responsable de l'association en question.";
                    break;
                }
                await association.removeMember(targetMember);
                reply = "**Vous avez bien expulsé " + memberMention.user.username + " de l'association " + await association.getName() + "**";
                break;

            case 'setrole':
                var targetAssociation = interaction.options.getString('association');
                var association = await AssociationsManager.getAssociationByID(targetAssociation);
                var memberMention = interaction.options.getMentionable('membre');
                var targetMember = await UsersManager.getUser(memberMention.id);
                var targetRole = interaction.options.getString('role');
                if (!association) {
                    reply = "L'association " + targetAssociation + " n'existe pas.";
                    break;
                }
                if (targetMember === null) {
                    reply = "Le membre" + targetMember.name + " n'a pas été trouvé en base de données.";
                    break;
                }
                if ((await targetMember.getAssociationRole(association.id)) === null) {
                    reply = "Le membre " + targetMember.name + " n'est pas membre de l'association " + await association.getName() + ".";
                    break;
                }

                // Need Determine which status to set to member
                let roleStatus = 0;
                switch(targetRole) {
                    case 'member':
                        roleStatus = 0;
                        break;
                    case 'responsable':
                        roleStatus = 1;
                        break;
                    case 'tresorier':
                        roleStatus = 2;
                        break;
                    case 'vicepresident':
                        roleStatus = 3;
                        break;
                    case 'president':
                        roleStatus = 4;
                        break;
                    default:
                        roleStatus = 0;
                        break;
                }

                await targetMember.setAssociationRole(association.asso_id, roleStatus);
                await targetMember.updateAssociationsServerPermissions();
                reply = "**Vous avez bien mis à jour le rôle de " + targetMember.user.username + " au sein de l'association " + await association.getName() + ", étant maintenant " + targetRole + "**";
                break;
            case 'update':
                var memberMention = interaction.options.getMentionable('membre');
                var targetMember = await UsersManager.getUser(memberMention.id);
                if (targetMember === null) {
                    reply = "Le membre" + targetMember.name + " n'a pas été trouvé en base de données.";
                    break;
                }
                if (!authorUserObject.permissions.has("MANAGE_ROLES"))
                {
                    reply = "Vous n'avez pas la permission de faire cela car vous ne pouvez pas gérer les rôles.";
                    break;
                }
                await targetMember.updateAssociationsServerPermissions();
                reply = "**Vous avez bien mis à jour les rôles de " + targetMember.user.username + "**";
                break;
            default:
                reply = "*Commande invalide.*";
                break;
        }
        await defering;
        interaction.editReply(reply);
    }
};