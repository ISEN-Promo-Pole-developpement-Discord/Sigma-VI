const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require("discord.js");
const welcomeProcess = require("./welcomeProcess.json");
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

    if (fields.answers.map((x) => {return x.id}).includes(id)) {
        for (answer of fields.answers) {
            if (answer.id === id) {
                answer.value = value;
            }
        }
    } else {
        fields.answers.push({id: id, value: value});
    }

    await form.setFields(JSON.stringify(fields));
}

module.exports = {
    handleWelcomeButtonClick(interaction) {
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
        
        else if (interaction.message.content.split("\n").length === 1){
            interaction.update(interaction.message.content);
            responseFromWelcomeProcess(-1, interaction);
        } else {
            const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));

            if (!interaction.message.editedAt) {
                interaction.update(interaction.message.content);
                responseFromWelcomeProcess(step.step, interaction);
            }
        }
    },
    handleWelcomeFormMenuResponse(interaction) {

        const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));
        
        if (interaction.message.components.length === 1) {
            if (!interaction.message.editedAt) {
                responseFromWelcomeProcess(step.step, interaction);
            }
        }

        if (interaction.message.components.length === 1) {
            interaction.update({
                content: `**${step.name}**\nVous avez répondu :\n${interaction.values.map(value => {
                    for (const option of interaction.component.options) {
                        if (option.value === value) {
                            return `${option.emoji.name} ${option.label}`;
                        }
                    }
                }).join("\n")}\nVous pouvez modifier votre réponse en cliquant à nouveau sur le menu déroulant.`
            });
        } else {
            if (!interaction.message.editedAt) {
                interaction.update({
                    content: `**${step.name}**\nVous avez répondu :\n${interaction.values.map(value => {
                        for (const option of interaction.component.options) {
                            if (option.value === value) {
                                return `${option.emoji.name} ${option.label}`;
                            }
                        }
                    }).join("\n")}\nIl vous reste encore ${interaction.message.components.length - 1 > 1 ? `${interaction.message.components.length - 1} options`: "1 option"} à remplir ci-dessous.`
                });
            } else {
                let answers = [];
                
                for (const row of interaction.message.components) {
                    for (const option of row.components[0].data.options) {
                        for (str of interaction.message.content.split("\n")) {
                            if (str.includes(option.label)) {
                                if (!interaction.component.options.map(x => {return x.label}).includes(str.split(" ")[1])) {
                                    answers.push(str);
                                }
                            }
                        }
                    }
                }

                for (value of interaction.values) {
                    for (const option of interaction.component.options) {
                        if (option.value === value) {
                            answers.push(`${option.emoji.name} ${option.label}`);
                        }
                    }
                };

                if (answers.length < interaction.message.components.length) {
                    interaction.update({
                        content: `**${step.name}**\nVous avez répondu :\n${answers.join("\n")}\nIl vous reste encore ${interaction.message.components.length - 1 > 1 ? `${interaction.message.components.length - 1} options`: "1 option"} à remplir ci-dessous.`
                    });
                } else {
                    interaction.update({
                        content: `**${step.name}**\nVous avez répondu :\n${answers.join("\n")}\nVous pouvez modifier votre réponse en cliquant à nouveau sur le menu déroulant.`
                    });
                    if (interaction.channel.lastMessage === interaction.message) {
                        responseFromWelcomeProcess(step.step, interaction);
                    }
                }
            }
        }
    },
    handleWelcomeFormResponse(interaction) {
        let data = {}
        for (field of interaction.fields.components) {
            data[field.components[0].customId] = field.components[0].value
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

                    const name = fields.answers.find((x) => x.id === "name").value;
                    const surname = fields.answers.find((x) => x.id === "surname").value;
                    let mail = fields.answers.find((x) => x.id === "mail");
                    
                    if (mail) {
                        mail = mail.value;
                    } else {
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
                content: `**${step.name}**\nVous avez répondu :\n${Object.values(data).join("\n")}\nVous pouvez modifier le formulaire en cliquant sur le bouton Modifier ci-dessous`,
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
}