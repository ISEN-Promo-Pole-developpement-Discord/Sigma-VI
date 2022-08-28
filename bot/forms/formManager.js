const { handleWelcomeButtonClick, handleWelcomeFormResponse, handleWelcomeFormMenuResponse } = require("./welcomeForm/welcomeForm.js");

module.exports = {
    handleButtonClickForm(interaction) {
        if (interaction.customId.toLowerCase().includes("welcome")) {
            handleWelcomeButtonClick(interaction);
            return;
        }
    },
    handleFormResponse(interaction) {
        if (interaction.customId.toLowerCase().includes("welcome")) {
            handleWelcomeFormResponse(interaction);
            return;
        }
    },
    handleMenuFormResponse(interaction) {
        if (interaction.customId.toLowerCase().includes("welcome")) {
            handleWelcomeFormMenuResponse(interaction);
            return;
        }
    }
}