const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, ComponentType, Emoji } = require("discord.js");
const welcomeFormData = require("./welcomeForm.json");
const welcomeProcess = require("./welcomeProcess.json");
const generalNodes = require("./../generalNodes.json");
const db = require("../../bdd/utilsDB");
const { sendCodeMail } = require("../sendMail.js");
const { FormsManager } = require("../../bdd/classes/formsManager.js");
const { Form } = require("../../bdd/classes/form.js");

function searchNode(id, currentNode) {
    let result;
       
    for (const [key, value] of Object.entries(currentNode)) {
        if (key === "menu" && value.value === id)  return currentNode;
        if (value !== null && typeof value === "object" || typeof value === "array") {
            result = searchNode(id, value);
            if (result) {
                return result;
            }
        }
    }

    return null;
}

function getWelcomeSelectMenusFromJSON(id) {
    let menus = new Array();

    const valueOfResponse = searchNode(id, welcomeFormData);
    if (valueOfResponse) {
        const subMenu = new SelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1);
        for (const [subKey, subValue] of Object.entries(valueOfResponse)) {
            if(subValue.menu) {
                subMenu.addOptions(new SelectMenuOptionBuilder(subValue.menu));
            } else if (subValue.length) {
                for (menuOption of subValue) {
                    subMenu.addOptions(new SelectMenuOptionBuilder(menuOption));
                }
            }
            if (Object.keys(generalNodes).includes(subKey)) {
                if (subValue) {
                    const generalMenu = new SelectMenuBuilder()
                        .setMinValues(1)
                        .setMaxValues(1);
                
                    for (const generalValue of Object.values(generalNodes[subKey])) {
                        generalMenu.addOptions(new SelectMenuOptionBuilder(generalValue));
                    }
                    generalMenu.setPlaceholder(subKey);
                    generalMenu.setCustomId(`welcomeForm_${subKey}`);
                    menus.push(generalMenu);
                }
            }
        }

        if(subMenu.options.length !== 0) {
            subMenu.setPlaceholder(id.split("_").at(-1));
            subMenu.setCustomId(`${id}-subMenu`);
            menus.push(subMenu);
        }
    }

    if (menus.length !== 0) {
        let rows = new Array();

        for (const menu of menus) {
            rows.push(new ActionRowBuilder().addComponents(menu));
        }

        return rows;
    } else {
        return null;
    }
    
}

async function isSkipped(interaction, stepData) {
    if (stepData.condition) {
        const form = await FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id);
        const fields = await form.getFields();
        const answer = fields.answers.find((x) => x.id === stepData.condition.value);
        if (answer) {
            switch (stepData.condition.type) {
                case "valueExists":
                    if (typeof(answer.value) === undefined) {
                        return true;
                    }
                    return false;
                case "valueIsTrue":
                    if (answer.value == false) {
                        return true;
                    }
                    return false;
                case "valueIsFalse":
                    if (answer.value == true) {
                        return true;
                    }
                    return false;
                case "valueIncludes":
                    if (answer.value.includes(stepData.condition.valueSearched)) {
                        return true;
                    }
                    return false;
                case "valueIs":
                    if (answer.value != stepData.condition.valueSearched) {
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

function responseFromWelcomeProcess(currentStep, interaction) {
    if (welcomeProcess.tasks[currentStep]) {
        if (welcomeProcess.tasks[currentStep].toAsk.type === "welcomeMenus") {
            if (interaction.message.components.length === 1) {
                const next = searchNode(interaction.values[0], welcomeFormData);
                if (next) {
                    const stepData = welcomeProcess.tasks[currentStep];
                    return interaction.channel.send({
                        content: `**${stepData.name}**\noui`,
                        components: getWelcomeSelectMenusFromJSON(interaction.values[0])
                    });
                }
            }
        }
    }

    let channel = undefined;

    if (currentStep === -1) {
        channel = interaction.channel;
        //channel = createThread();

        FormsManager.addForm({user_id: interaction.user.id, guild_id: interaction.guild.id, channel_id: channel.id, status: 1, fields: JSON.stringify({answers:[{id: interaction.customId.split("_").at(-2), value: interaction.customId.split("_").at(-1)}]})});
    } else {
        channel = interaction.channel;
    }

    currentStep++;
    const stepData = welcomeProcess.tasks[currentStep];

    isSkipped(interaction, stepData).then((skipped => {
        if (skipped === true) {
            return responseFromWelcomeProcess(currentStep, interaction);
        } else {
            if (stepData.toAsk.type === "Modal") {
                return channel.send({
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
                
                return channel.send({
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
                
                FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id).then(async (form) => {
                    const fields = await form.getFields();
                    const profileAnswer = fields.answers.find((x) => x.id === "generalProfile");

                    channel.send({
                        content: `**${stepData.name}**\n${stepData.description}`,
                        components: getWelcomeSelectMenusFromJSON(`welcomeForm_generalProfile_${profileAnswer.value}`)
                    });
                    //return `welcomeForm_${profileAnswer.id}_${profileAnswer.value}`;
                });

                return;
            } else if (stepData.toAsk.type === "RowButtons") {
                return channel.send({
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
        
                FormsManager.getForm(interaction.user.id, interaction.guild.id, interaction.channel.id).then(async (form) => {
                    const verificationCode = await form.generateVerificationCode();

                    const fields = await form.getFields();

                    const name = fields.answers.find((x) => x.id === "name").value;
                    const surname = fields.answers.find((x) => x.id === "surname").value;
                    let mail = fields.answers.find((x) => x.id === "mail");

                    if (mail) {
                        mail = mail.value;
                    } else {
                        mail = `${surname.replaceAll(" ", "-").toLowerCase()}.${name.replaceAll(" ", "-").toLowerCase()}@isen.yncrea.fr`;
                    }

                    console.log(name, surname, mail);
                    
                    
                    sendCodeMail({name: name, surname: surname, mail: mail, tag: interaction.user.tag}, verificationCode);

                    channel.send({
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
                });
        
                return;
            } else if (stepData.toAsk.type === "adminValidate") {
                return channel.send({
                    content: `**${stepData.name}**\nSalut monsieur l'administrateur tu peux vérifier stp ? Merci !`
                });
            }
        
            return channel.send("Fin du formulaire.");
        }
    }));
}

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
            checkCodeMail(interaction, Object.values(data)[0]).then((result) => {
                if (result) {
                    interaction.update({
                        content: `**${step.name}**\n✅ Votre adresse e-mail a bien été vérifiée. Merci.`,
                        components: []
                    });
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