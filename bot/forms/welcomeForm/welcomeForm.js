const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require("discord.js");
const welcomeProcess = require("./welcomeProcess.json");
const welcomeFormData = require("./welcomeForm.json");
const { FormsManager } = require("../../bdd/classes/formsManager.js");
const { responseFromWelcomeProcess } = require("./welcomeProcessManager.js");

function searchStepFromName(name) {
    for (const step of welcomeProcess.tasks) {
        if (step.name === name) {
            return step;
        }
    }

    return null;
}

async function checkCodeMail(interaction, code) {

    const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id)
    const verificationCode = await form.getVerificationCode();

    if (code === verificationCode) {
        return true;
    }

    return false;
}

async function registerAnswer(form, id, value) {
    let fields = await form.getFields();

    fields[id] = value;

    await form.setFields(fields);
}

function handleWelcomeButtonClick(interaction) {

    if (interaction.customId.includes("launch") || interaction.customId.includes("modify")) {
        for (const task of welcomeProcess.tasks) {
            if (task.toAsk.id) {
                if (task.toAsk.id.includes(interaction.customId.slice(7))) {
                    const modal = new ModalBuilder()
                        .setCustomId(`${task.toAsk.id}`)
                        .setTitle(`${task.toAsk.title}`);

                    let rows = new Array();

                    for (const field of task.toAsk.fields) {
                        rows.push(new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId(`${field.id}`)
                                .setLabel(`${field.label}`)
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(task.toAsk.id === "welcomeForm_checkMail" ? 6 : 64)
                        ));
                    }

                    modal.setComponents(rows);
                    interaction.showModal(modal);
                    
                    return;
                }
            }
        }
    } else if (interaction.customId.includes("dopass")) {
        for (const task of welcomeProcess.tasks) {
            if (task.toAsk.id) {
                if (task.toAsk.id.includes(interaction.customId.slice(7))) {
                    interaction.update({
                        content: `**${task.name}**\nVous avez passé cette étape. Vous pouvez malgré tout toujours remplir le code en cliquant sur le bouton ci-dessous.`,
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`launch_${interaction.customId}`)
                                    .setLabel(`Saisir le code reçu par e-mail`)
                                    .setCustomId(`launch_${task.toAsk.id}`)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(false)
                            )
                        ]
                    });
                    
                    responseFromWelcomeProcess(task.step, interaction);
                    
                    return;
                }
            }
        }
    } 
    
    else if (Object.values(welcomeFormData).map((x) => {return x.menu.value}).includes(interaction.customId)){
        responseFromWelcomeProcess(-1, interaction);
    } else {
        const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));

        if (!interaction.message.editedAt) {
            interaction.update(interaction.message.content);
            responseFromWelcomeProcess(step.step, interaction);
        }
    }
}


async function handleWelcomeFormMenuResponse(interaction) {
    const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));
    const id = interaction.values[0].split("_").at(-2);
    const value = interaction.values[0].split("_").at(-1);

    const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id);
    if(!form){
        console.log(">> form not found");
        return;
    }
    const formAnswers = await form.getFields();
    var formCompletedFields = Object.keys(formAnswers);

    registerAnswer(form, id, value);

    var menuSelectorIds = new Array();
    for(const actionRow of interaction.message.components) {
        for(const selectMenu of actionRow.components) {
            menuSelectorIds.push(selectMenu.customId);
        }
    }

    var notCompletedMenuFields = new Array();
    for (const menuSelectorId of menuSelectorIds) {
        var menuSelectorFieldName = menuSelectorId.split("_").at(-1);
        if(!formCompletedFields.includes(menuSelectorFieldName)) {
            notCompletedMenuFields.push(menuSelectorFieldName);
        }
    }

    if(notCompletedMenuFields.length == 1) {
        if(notCompletedMenuFields[0] == id) {
            responseFromWelcomeProcess(step.step, interaction);
        }
    }

    interaction.deferUpdate();
}

function handleWelcomeFormResponse(interaction) {
    let data = {}
    for (field of interaction.fields.components) {
        data[field.components[0].customId] = field.components[0].value.trim();
    }

    const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));

    if (interaction.customId.includes("checkMail")) {
        checkCodeMail(interaction, Object.values(data)[0]).then(async (result) => {
            if (result) {
                interaction.update({
                    content: `**${step.name}**\n✅ Votre adresse e-mail a bien été vérifiée. Merci.`,
                    components: []
                });
                const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id)

                const fields = await form.getFields();

                const name = fields.name;
                const surname = fields.surname;
                let mail = fields.mail;
                
                if (!mail) {
                    mail = `${surname.replaceAll(" ", "-").toLowerCase()}.${name.replaceAll(" ", "-").toLowerCase()}@isen.yncrea.fr`;
                }
                
                await registerAnswer(form, "mail", mail);
                await registerAnswer(form, "mailValidated", true);
                responseFromWelcomeProcess(step.step, interaction);
            } else {
                interaction.update({
                    content: `**${step.name}**\n❌ Vous venez de rentrer le mauvais code. Veuillez réessayer, ou cliquer sur Passer pour procéder à une vérification manuelle.`,
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`launch_${interaction.customId}`)
                                .setLabel(`Ressaisir le code reçu par e-mail`)
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId(`dopass_${interaction.customId}`)
                                .setLabel(`Passer`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(false)
                        )
                    ]
                });
                const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id)
                await registerAnswer(form, "mailValidated", false);
            }
        });
    } else {
        if (!interaction.message.editedAt) {
            responseFromWelcomeProcess(step.step, interaction);
        }

        FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id).then(async (form) => {
            for (key of Object.keys(data)) {
                await registerAnswer(form, key.split("_").at(-1), data[key]);
            }
        });

        interaction.update({
            content: `**${step.name}**\n> *${Object.values(data).join("*\n> *")}*\nVous pouvez modifier votre réponse en cliquant sur le bouton Modifier`,
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`launch_${interaction.customId}`)
                        .setLabel(`Formulaire rempli`)
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId(`modify_${interaction.customId}`)
                        .setLabel(`Modifier`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false)
                )
            ]
        });
    }
}

module.exports = {
    handleWelcomeButtonClick,
    handleWelcomeFormMenuResponse,
    handleWelcomeFormResponse
}