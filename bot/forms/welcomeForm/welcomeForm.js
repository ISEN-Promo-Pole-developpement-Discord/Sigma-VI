const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const welcomeFormData = require("./welcomeForm.json");
const generalNodes = require("./../generalNodes.json");

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

module.exports = {
    handleWelcomeButtonClick(interaction) {
        const modal = new ModalBuilder()
                .setCustomId(`modalWelcomeForm`)
                .setTitle(`${interaction.component.label}`);

        let menus = new Array();

        const valueOfResponse = searchNode(interaction.customId, welcomeFormData);
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
                subMenu.setPlaceholder(interaction.customId);
                subMenu.setCustomId(`${interaction.customId}_subMenu`);
                menus.push(subMenu);
            }
        }

        
        
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
        ].concat(menus);

        let rows = new Array();

        for (const cell of cells) {
            rows.push(new ActionRowBuilder().addComponents(cell));
        }

        modal.setComponents(rows);
        interaction.showModal(modal);
    }
}