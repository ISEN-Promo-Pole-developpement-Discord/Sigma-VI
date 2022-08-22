const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, ComponentType, Emoji } = require("discord.js");
const welcomeFormData = require("./welcomeForm.json");
const welcomeProcess = require("./welcomeProcess.json");
const generalNodes = require("./../generalNodes.json");
const db = require("../../bdd/utilsDB");
const { sendCodeMail } = require("../sendMail.js");

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

    currentStep++;
    const stepData = welcomeProcess.tasks[currentStep];
    if (stepData.toAsk.type === "Modal") {
        return interaction.channel.send({
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
        
        return interaction.channel.send({
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
        //TODO: search in the database what was the initial answer of the user (Étudiant, Invité,...)
        const userState = 0;
        switch(userState) {
            case 0:
                return interaction.channel.send({
                    content: `**${stepData.name}**\n${stepData.description}`,
                    components: getWelcomeSelectMenusFromJSON("welcomeForm_menu_EtudiantISEN")
                });
            case 1:
                return interaction.channel.send({
                    content: `**${stepData.name}**\n${stepData.description}`,
                    components: getWelcomeSelectMenusFromJSON("welcomeForm_menu_ProfISEN")
                });
            case 2:
                return interaction.channel.send({
                    content: `**${stepData.name}**\n${stepData.description}`,
                    components: getWelcomeSelectMenusFromJSON("welcomeForm_menu_AdministrationISEN")
                });
            case 3:
                return interaction.channel.send({
                    content: `**${stepData.name}**\n${stepData.description}`,
                    components: getWelcomeSelectMenusFromJSON("welcomeForm_menu_Invité")
                });
        }
    } else if (stepData.toAsk.type === "RowButtons") {
        return interaction.channel.send({
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

        sendCodeMail(interaction.user, "569874");

        return interaction.channel.send({
            content: `**${stepData.name}**\n${stepData.description}`,
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
    } else if (stepData.toAsk.type === "adminValidate") {
        return interaction.channel.send({
            content: `**${stepData.name}**\nSalut monsieur l'administrateur tu peux vérifier stp ? Merci !`
        });
    }

    return interaction.channel.send("Fin du formulaire.");
}

function searchStepFromName(name) {
    for (const step of welcomeProcess.tasks) {
        if (step.name === name) {
            return step;
        }
    }

    return null;
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
        } else if (interaction.message.content.split("\n").length === 1){
            responseFromWelcomeProcess(-1, interaction);
        } else {
            const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));

            if (!interaction.message.editedAt) {
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
            
        } else {
            if (!interaction.message.editedAt) {
                responseFromWelcomeProcess(step.step, interaction);
            }
    
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