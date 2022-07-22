const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require("discord.js")
const welcomeFormData = require("./welcomeForm/welcomeForm.json");

function findValueFromId(json, id) {
    for ([key, value] of Object.entries(json)) {
        if (value.menu.value === id) {
            return json[key];
        }
    }

    return null;
}

function getSelectMenuFromJSON(json, response) {
    let menus = new Array();
    
    if (response) {
        //TODO: manage the depth of a menu
        for (r of response) {
            const valueOfResponse = findValueFromId(json, r);
            if (valueOfResponse) {
                const subMenu = new SelectMenuBuilder()
                    .setMinValues(1)
                    .setMaxValues(1);
                for (subValue of Object.values(valueOfResponse)) {
                    if(subValue.menu) {
                        subMenu.addOptions(new SelectMenuOptionBuilder(subValue.menu));
                    } else if (subValue.length) {
                        if (!subValue[0].value.toLowerCase().includes("lv2")) {
                            for (menuOption of subValue) {
                                subMenu.addOptions(new SelectMenuOptionBuilder(menuOption));
                            }
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
        const actionRows = getSelectMenuFromJSON(welcomeFormData, interaction.values);

        if (actionRows) {
            interaction.update({components: actionRows});
        } else {
            interaction.update({content: "Profondeur maximale atteinte.", components: []});
        }
    }
}