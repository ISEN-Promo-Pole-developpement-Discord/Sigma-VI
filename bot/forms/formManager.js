const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require("discord.js")

module.exports = {
    getSelectMenuFromJSON(json, response) {
        let menus = new Array();
        
        if (response) {
            //TODO: manage the depth of a menu
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
        
        if (menus !== []) {
            for (let menu of menus) {
                rows.push(new ActionRowBuilder().addComponents(menu));
            }

            return rows;
        } else {
            console.error("Failed to create one or more rows from parameters.")
            return null;
        }
    }
}