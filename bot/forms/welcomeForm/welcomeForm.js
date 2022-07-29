const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const welcomeFormData = require("./welcomeForm.json");
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

module.exports = {
    handleWelcomeButtonClick(interaction) {
        const modal = new ModalBuilder()
                .setCustomId(`modalWelcomeForm-${interaction.customId}`)
                .setTitle(`${interaction.component.label}`);
        
        const cells = [
            new TextInputBuilder()
                .setCustomId(`welcomeFormSurname`)
                .setLabel("Votre prénom")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(64),
            new TextInputBuilder()
                .setCustomId(`welcomeFormName`)
                .setLabel("Votre nom")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(64)
        ];

        let rows = new Array();

        for (const cell of cells) {
            rows.push(new ActionRowBuilder().addComponents(cell));
        }

        modal.setComponents(rows);
        interaction.showModal(modal);
    },
    handleWelcomeFormMenuResponse(interaction) {
        console.log(interaction.values);
        let next = searchNode(interaction.values[0], welcomeFormData);
        if (interaction.message.components.length === 1) {
            if (next) {
                interaction.reply({
                    content: `Vous avez choisi ${next.menu.label}. Veuillez remplir le reste du formulaire :`,
                    fetchReply: true,
                    ephemeral: true,
                    components: getWelcomeSelectMenusFromJSON(interaction.values[0])
                });
                // USER DATA
                let userData = "";
                if (interaction.customId === "modalWelcomeForm-welcomeForm_menu_EtudiantISEN")
                {
                    let userClass = interaction.values[0].split("_");
                    userData = `(JSON){ class:"${userClass[2]}"}`;
                }
                else if (interaction.customId === "modalWelcomeForm-welcomeForm_menu_Invité")
                {
                    let userCat = interaction.values[0].split("_");
                    userData = `(JSON){ category:"${userCat[2]}"}`;
                }
                // else if (interaction.customId === "modalWelcomeForm-welcomeForm_menu_ProfISEN")
                // {
                //     // USER DATA - TOPICS
                // }
                // else if (interaction.customId === "modalWelcomeForm-welcomeForm_menu_AdministrationISEN")
                // {
                //     // ???
                // }

                // USER DATA MODIFICATION IN DB
                db.connection.query(`UPDATE user SET user_data = '{"class": "${userData}"}' WHERE user_id = "${interaction.member.id}"`);
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
    },
    handleWelcomeFormResponse(interaction) {
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
    }
}