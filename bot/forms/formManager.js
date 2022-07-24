const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require("discord.js");
const { handleWelcomeFormInteraction } = require("./welcomeForm/welcomeForm.js");
const welcomeFormData = require("./welcomeForm/welcomeForm.json");
const generalNodes = require("./generalNodes.json");

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

function getSelectMenuFromJSON(json, response) {
    let menus = new Array();
    
    if (response) {
        for (const r of response) {
            const valueOfResponse = searchNode(r, json);
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
                    subMenu.setPlaceholder(r);
                    subMenu.setCustomId(`${r}_subMenu`);
                    menus.push(subMenu);
                }
            }
        }
    } else {
        const mainMenu = new SelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1);

        for (value of Object.values(json)) {
            mainMenu.addOptions(new SelectMenuOptionBuilder(value.menu));
        }
        mainMenu.setPlaceholder("Sélectionnez un profil");
        //TODO: set a real customID
        mainMenu.setCustomId("mainMenuProvisoire");

        menus.push(mainMenu);
    }

    let rows = new Array();
    
    if (menus.length !== 0) {
        for (let menu of menus) {
            rows.push(new ActionRowBuilder().addComponents(menu));
        }

        return rows;
    } else {
        return null;
    }
}

module.exports = {
    getSelectMenuFromJSON,
    handleFormResponse(interaction) {
        for (value of interaction.values) {
            if (value.toLowerCase().includes("welcomeform")) {
                handleWelcomeFormInteraction(interaction);
            }
        }

        
        let actionRows = getSelectMenuFromJSON(welcomeFormData, interaction.values);

        //TODO: handle more than one SelectMenu
        if (actionRows) {
            interaction.update({components: actionRows});
        } else {
            interaction.update({content: "Profondeur maximale atteinte.", components: []});
        }
    }
}