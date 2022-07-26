const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { handleWelcomeButtonClick } = require("./welcomeForm/welcomeForm.js");

function getButtonsFromJSON(json, response) {
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

module.exports = {
    getButtonsFromJSON,
    handleButtonClickForm(interaction) {
        if (interaction.customId.toLowerCase().includes("welcome")) {
            handleWelcomeButtonClick(interaction);
        }
    }
}