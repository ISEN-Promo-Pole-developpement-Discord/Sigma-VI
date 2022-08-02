const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, ComponentType, Emoji } = require("discord.js");
const welcomeFormData = require("./welcomeForm.json");
const welcomeProcess = require("./welcomeProcess.json");
const generalNodes = require("./../generalNodes.json");
const db = require("../../bdd/utilsDB");

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
                    generalMenu.setCustomId(`${subKey}_menu`);
                    menus.push(generalMenu);
                }
            }
        }

        if(subMenu.options.length !== 0) {
            subMenu.setPlaceholder(id);
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
            return interaction.reply("tkt les menus ça arrive de fou");
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
    }
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
                                    .setMaxLength(64)
                            ));
                        }

                        modal.setComponents(rows);
                        interaction.showModal(modal);
                        return;
                    }
                }
            }
        } else {
            responseFromWelcomeProcess(-1, interaction);
        }
    },
    handleWelcomeFormMenuResponse(interaction) {

        const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));

        if (!interaction.message.editedAt) {
            responseFromWelcomeProcess(step.step, interaction);
        }

        interaction.update({
            content: `**${step.name}**\nVous avez répondu :\n${interaction.values.map(value => {
                for (const option of interaction.component.options) {
                    if (option.value === value) {
                        return `${option.emoji.name} ${option.label}`;
                    }
                }
            }).join("\n")}\nVous pouvez modifier votre réponse en cliquant à nouveau sur le menu déroulant.`
        });

        /*
        let next = searchNode(interaction.values[0], welcomeFormData);
        console.log(interaction.customId);
        if (interaction.message.components.length === 1) {
            if (next) {
                interaction.reply({
                    content: `Vous avez choisi ${next.menu.label}. Veuillez remplir le reste du formulaire :`,
                    fetchReply: true,
                    ephemeral: true,
                    components: getWelcomeSelectMenusFromJSON(interaction.values[0])
                });
                // USER DATA
                let userData = "{}";
                if (interaction.customId === "welcomeForm_menu_EtudiantISEN-subMenu")
                {
                    let userClass = interaction.values[0].split("_");
                    userData = `{"class": "${userClass[2]}"}`;
                }
                else if (interaction.customId === "welcomeForm_menu_Invité-subMenu")
                {
                    let userCat = interaction.values[0].split("_");
                    userData = `{"category": "${userCat[2]}"}`;
                }
                // else if (interaction.customId === "welcomeForm_menu_ProfISEN-subMenu")
                // {
                //     // USER DATA - TOPICS
                // }
                // else if (interaction.customId === "welcomeForm_menu_AdministrationISEN-subMenu")
                // {
                //     // ???
                // }

                // USER DATA MODIFICATION IN DB
                db.connection.query(`UPDATE user SET user_data = '${userData}' WHERE user_id = '${interaction.member.id}'`);
            } else {
                interaction.reply({
                    content: `Récapitulatif des données (en gros parcourir la base de données). Si tout est bon pour vous, vous pouvez accepter ou recommencer le formulaire.`,
                    fetchReply: true,
                    ephemeral: true,
                    components: [
                        new ActionRowBuilder().addComponents(new ButtonBuilder()
                            .setCustomId("finishForm")
                            .setLabel("Accepter et envoyer le formulaire")
                            .setEmoji('✅')
                            .setStyle(ButtonStyle.Success)
                        ),
                        new ActionRowBuilder().addComponents(new ButtonBuilder()
                            .setCustomId("retryForm")
                            .setLabel("Recommencer le formulaire")
                            .setEmoji('❌')
                            .setStyle(ButtonStyle.Danger)
                        )
                    ]
                });
            }
        } else {
            interaction.reply({
                content: `c'est juste pas encore implémenté en fait`,
                fetchReply: true,
                ephemeral: true,
                components: []
            });
        }
        */
    },
    handleWelcomeFormResponse(interaction) {

        let data = {}
        for (field of interaction.fields.components) {
            data[field.components[0].customId] = field.components[0].value
        }

        const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));

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

        /*
        const [name, surname] = interaction.fields.fields.entries();

        if (getWelcomeSelectMenusFromJSON(interaction.customId.split("-")[1])) {
            interaction.reply({
                content: `Bienvenue ${name[1].value} ${surname[1].value}. Veuillez choisir votre profil :`,
                fetchReply: true,
                ephemeral: true,
                components: getWelcomeSelectMenusFromJSON(interaction.customId.split("-")[1])
            });
            // User Status Identification
            let userStatus;
            if (interaction.customId === "modalWelcomeForm-welcomeForm_menu_EtudiantISEN") userStatus = 0;
            else if (interaction.customId === "modalWelcomeForm-welcomeForm_menu_Invité") userStatus = 3;
            else if (interaction.customId === "modalWelcomeForm-welcomeForm_menu_ProfISEN") userStatus = 1;
            else if (interaction.customId === "modalWelcomeForm-welcomeForm_menu_AdministrationISEN") userStatus = 2;

            // VERIFICATION : DOES THE USER ALREADY GOT A LINE IN user TABLE ?
            db.connection.query(`SELECT * FROM user WHERE user_id = ${interaction.member.id}`, function(err, row)
            {
                if (err) {
                    console.log("ERROR IN DB");
                    console.log(err);
                }
                else {
                    // If there is no data in db for this user
                    if (!(row && row.length))
                        db.connection.query(`INSERT INTO user(user_id, name, surname, status, user_data) VALUES
                            ('${interaction.member.id}', '${name[1].value}', '${surname[1].value}', ${userStatus}, '{}')`);
                    else   // If there is data in db for this user
                        db.connection.query(`UPDATE user
                            SET name = '${name[1].value}',
                            surname = '${surname[1].value}',
                            status = ${userStatus},
                            user_data = '{}'
                        WHERE user_id = ${interaction.member.id}`);
                }
            });
        } else {
            interaction.reply({
                content: `Récapitulatif des données (en gros parcourir la base de données). Si tout est bon pour vous, vous pouvez accepter ou recommencer le formulaire.`,
                fetchReply: true,
                ephemeral: true,
                components: [
                    new ActionRowBuilder().addComponents(new ButtonBuilder()
                        .setCustomId("finishForm")
                        .setLabel("Accepter et envoyer le formulaire")
                        .setEmoji('✅')
                        .setStyle(ButtonStyle.Success)
                    ),
                    new ActionRowBuilder().addComponents(new ButtonBuilder()
                        .setCustomId("retryForm")
                        .setLabel("Recommencer le formulaire")
                        .setEmoji('❎')
                        .setStyle(ButtonStyle.Danger)
                    )
                ]
            });
        }
        */
    }
}