const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { sendCodeMail } = require("../sendMail.js");
const welcomeFormData = require("./welcomeForm.json");
const welcomeProcess = require("./welcomeProcess.json");
const { searchNode, getSelectMenusFromJSON } = require("../../utils/formHelper.js");
const { FormsManager } = require("../../bdd/classes/formsManager.js");
const { createThread } = require("../../utils/channelManager.js");
const { assignRoles, assignVerifiedRole } = require("../../utils/rolesManager.js");
const { UsersManager } = require("../../bdd/classes/usersManager.js");
const { logCreate } = require("../../modtools/log/logModules.js");

async function isSkipped(interaction, stepData) {
    if (stepData.condition) {
        const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id);
        const fields = await form.getFields();
        const answer = fields[stepData.condition.value];
        if (answer) {
            switch (stepData.condition.type) {
                case "valueExists":
                    if (typeof(answer) === undefined) {
                        return true;
                    }
                    return false;
                case "valueIsTrue":
                    if (answer == false) {
                        return true;
                    }
                    return false;
                case "valueIsFalse":
                    if (answer == true) {
                        return true;
                    }
                    return false;
                case "valueIncludes":
                    if (answer.includes(stepData.condition.valueSearched)) {
                        return true;
                    }
                    return false;
                case "valueIs":
                    if (answer != stepData.condition.valueSearched) {
                        return true;
                    }
                    return false;
                default:
                    return false;
            }
        }
        return false;
    }
    return false;
}

async function submitForm(interaction) {
    const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id);

    await form.setStatus(3);

    const fields = await form.getFields();
    const name = fields.name;
    const surname = fields.surname;

    let displayedName;

    if (name.includes(" ")) {
        displayedName = `${name.split(" ").map((x) => {return x.charAt(0).toUpperCase()}).join("")}`
    } else if (name.includes("-")) {
        displayedName = `${name.split("-").map((x) => {return x.charAt(0).toUpperCase()}).join("")}`
    } else {
        displayedName = `${name.charAt(0).toUpperCase()}`
    }

    await interaction.member.setNickname(`${surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase()} ${displayedName}.`);

    await assignVerifiedRole(interaction.user, interaction.guild);

    await assignRoles(interaction.member, interaction.guild, Object.values(fields));
    let userStatus;
    switch (fields.generalProfile) {
        case "EtudiantISEN":
            userStatus = 0;
            break;
        case "ProfISEN":
            userStatus = 1;
            break;
        case "AdministrationISEN":
            userStatus = 2;
            break;
        case "Invité":
            userStatus = 3;
            break;
        default:
            userStatus = -1;
    }
    const userDB = await UsersManager.getUser(interaction.user.id);
    await userDB.setName(name);
    await userDB.setSurname(surname);
    await userDB.setEmail(fields.mail);
    await userDB.setStatus(userStatus);
    let userData = {}
    for (const id of Object.keys(fields)) {
        if (id !== "name" && id !== "surname" && id !== "mail" && id !== "generalProfile"){
            userData[id] = fields[id];
        }
    }
    await userDB.setData(userData);

    logCreate(
        interaction.guild,
        "Form",
        null,
        fields,
        "io"
    );

    await interaction.channel.delete();

    await FormsManager.deleteForm(form.form_id)
}


function responseFromWelcomeProcess(currentStep, interaction) {
    if (welcomeProcess.tasks[currentStep]) {
        if (welcomeProcess.tasks[currentStep].toAsk.type === "welcomeMenus") {
            if (interaction.message.components.length === 1) {
                const next = searchNode(interaction.values[0], welcomeFormData);
                if (next) {
                    const stepData = welcomeProcess.tasks[currentStep];
                    return interaction.channel.send({
                        content: `**${stepData.name}**\nVous avez encore des informations à remplir ci-dessous.`,
                        components: getSelectMenusFromJSON("welcomeForm", interaction.values[0], welcomeFormData)
                    });
                }
            }
        }
    }

    currentStep++;
    const stepData = welcomeProcess.tasks[currentStep];

    if(stepData) {
        isSkipped(interaction, stepData).then(async (skipped) => {
            let channel = undefined;

            if (currentStep === 0) {
                channel = await createThread(interaction.channel, `Welcome ${interaction.user.username}`, null, [interaction.user]);

                interaction.reply({
                    content: `Je vous ais créé un canal personnalisé pour remplir le formulaire de bienvenue.\n⬇️ Vous pouvez y accéder en cliquant sur le bouton ci-dessous ⬇️`,
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setLabel(`↪️ Commencer le formulaire`)
                                .setStyle(ButtonStyle.Link)
                                .setURL(channel.url)
                                .setDisabled(false)
                        )
                    ],
                    ephemeral: true
                })

                let fields = {}
                fields[interaction.customId.split("_").at(-2)] = interaction.customId.split("_").at(-1);

                await FormsManager.addForm({user_id: interaction.user.id, guild_id: interaction.guild.id, channel_id: channel.id, status: 1, fields: fields});
            } else {
                channel = interaction.channel;
            }


            if (skipped === true) {
                return responseFromWelcomeProcess(currentStep, interaction);
            } else {
                if (stepData.toAsk.type === "Modal") {
                    return await channel.send({
                        content: `**${stepData.name}**\n${stepData.description}`,
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`launch_${stepData.toAsk.id}`)
                                    .setLabel(`Renseigner son ${stepData.name}`)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(false),
                                new ButtonBuilder()
                                    .setCustomId(`modify_${stepData.toAsk.id}`)
                                    .setLabel(`Modifier`)
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true)
                            )
                        ]
                    });
                } else if (stepData.toAsk.type === "SelectMenu") {
                    const menuOptions = stepData.toAsk.options.map(option => {
                        return new SelectMenuOptionBuilder(option);
                    });
                    
                    return await channel.send({
                        content: `**${stepData.name}**\n${stepData.description}`,
                        components: [
                            new ActionRowBuilder().addComponents(
                                new SelectMenuBuilder()
                                    .setCustomId(`${stepData.toAsk.id}`)
                                    .setPlaceholder(`${stepData.toAsk.label}`)
                                    .setMinValues(1)
                                    .setMaxValues(1)
                                    .setOptions(menuOptions)
                            )
                        ]
                    });
                } else if (stepData.toAsk.type === "welcomeMenus") {
                    
                    const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id)
                    const fields = await form.getFields();
                    const profileAnswer = fields.generalProfile;

                    channel.send({
                        content: `**${stepData.name}**\n${stepData.description}`,
                        components: getSelectMenusFromJSON("welcomeForm", `welcomeForm_generalProfile_${profileAnswer}`, welcomeFormData)
                    });
    
                    return;
                } else if (stepData.toAsk.type === "RowButtons") {
                    return await channel.send({
                        content: `**${stepData.name}**\n${stepData.description}`,
                        components: [
                            new ActionRowBuilder().addComponents(stepData.toAsk.buttons.map(button => {
                                let style = null;
                                switch (button.style) {
                                    case "Primary":
                                        style = ButtonStyle.Primary;
                                        break;
                                    case "Secondary":
                                        style = ButtonStyle.Secondary;
                                        break;
                                    case "Success":
                                        style = ButtonStyle.Success;
                                        break;
                                    case "Danger":
                                        style = ButtonStyle.Danger;
                                        break;
                                    case "Link":
                                        style = ButtonStyle.Link;
                                        break;
                                }
                                
                                return new ButtonBuilder()
                                    .setCustomId(button.id)
                                    .setEmoji(button.emoji)
                                    .setLabel(button.label)
                                    .setStyle(style)
                            }))
                        ]
                    });
                } else if (stepData.toAsk.type === "checkMail") {
            
                    const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id)
                    const verificationCode = await form.generateVerificationCode();

                    const fields = await form.getFields();

                    const name = fields.name;
                    const surname = fields.surname;
                    let mail = fields.mail;

                    if (!mail) {
                        mail = `${surname.replaceAll(" ", "-").toLowerCase()}.${name.replaceAll(" ", "-").toLowerCase()}@isen.yncrea.fr`;
                    }
                    
                    
                    await sendCodeMail({name: name, surname: surname, mail: mail, tag: interaction.user.tag}, verificationCode);

                    await channel.send({
                        content: `**${stepData.name}**\nJe vous ai envoyé un mail à l'adresse __${mail}__\n${stepData.description}`,
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`launch_${stepData.toAsk.id}`)
                                    .setLabel(`Saisir le code reçu par e-mail`)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(false),
                                new ButtonBuilder()
                                    .setCustomId(`dopass_${stepData.toAsk.id}`)
                                    .setLabel(`Passer`)
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(false)
                            )
                        ]
                    });
            
                    return;
                } else if (stepData.toAsk.type === "adminValidate") {
                    return await channel.send({
                        content: `**${stepData.name}**\nSalut monsieur l'administrateur tu peux vérifier stp ? Merci !`
                    });
                }
            
                return await submitForm(interaction);
            }
        });
    } else {
        return submitForm(interaction);
    }
}
module.exports = {
    responseFromWelcomeProcess    
}