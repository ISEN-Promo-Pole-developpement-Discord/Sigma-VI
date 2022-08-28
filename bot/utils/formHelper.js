const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require("discord.js");
const generalNodes = require("../forms/generalNodes.json");

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
    searchNode,
    getSelectMenusFromJSON(formName, id, json) {
        let menus = new Array();

        const valueOfResponse = searchNode(id, json);
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
                        generalMenu.setCustomId(`${formName}_${subKey}`);
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
}
