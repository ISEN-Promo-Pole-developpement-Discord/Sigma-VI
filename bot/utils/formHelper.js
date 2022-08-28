const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const generalNodes = require("../forms/generalNodes.json");

function getButtonsFromJSON(json) {
    let buttons = new Array();
    for (const value of Object.values(json)) {
        buttons.push(new ButtonBuilder()
            .setLabel(value.menu.label)
            .setEmoji(value.menu.emoji)
            .setCustomId(value.menu.value)
            .setStyle(ButtonStyle.Primary)
        );
    }

    const actionRow = [new ActionRowBuilder({components: buttons})];

    return actionRow;
}

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
                if(subValue.menu){
                    subMenu.setPlaceholder(`${subValue.menu.value.split("_").at(-2).charAt(0).toUpperCase() + subValue.menu.value.split("_").at(-2).slice(1).toLowerCase()}`);
                    subMenu.setCustomId(`${formName}_${subValue.menu.value.split("_").at(-2)}`);
                }
                if(subValue.menu) {
                    subMenu.addOptions(new SelectMenuOptionBuilder(subValue.menu));
                } else if (subValue.length) {
                    const subMenuArray = new SelectMenuBuilder()
                        .setMinValues(1)
                        .setMaxValues(1);

                    subMenuArray.setPlaceholder(`${subValue[0].value.split("_").at(-2).charAt(0).toUpperCase() + subValue[0].value.split("_").at(-2).slice(1).toLowerCase()}`);
                    subMenuArray.setCustomId(`${formName}_${subValue[0].value.split("_").at(-2)}`);
                    
                    for (menuOption of subValue)
                        subMenuArray.addOptions(new SelectMenuOptionBuilder(menuOption));
                    menus.push(subMenuArray);
                }
                if (Object.keys(generalNodes).includes(subKey)) {
                    if (subValue) {
                        const subMenuGeneral = new SelectMenuBuilder()
                            .setMinValues(1)
                            .setMaxValues(1);
                    
                        for (const value of Object.values(generalNodes[subKey])) {
                            subMenuGeneral.addOptions(new SelectMenuOptionBuilder(value));
                        }
                        
                        subMenuGeneral.setPlaceholder(subKey);
                        subMenuGeneral.setCustomId(`${formName}_${subKey}`);

                        menus.push(subMenuGeneral);
                    }
                }
            }

            if(subMenu.options.length !== 0) {
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
        
    },
    getButtonsFromJSON
}
