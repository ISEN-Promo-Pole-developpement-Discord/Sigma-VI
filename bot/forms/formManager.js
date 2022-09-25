const { handleWelcomeButtonClick, handleWelcomeFormResponse, handleWelcomeFormMenuResponse } = require("./welcomeForm/welcomeForm.js");
const { handleVerificationRequest } = require("./welcomeFormChild/welcomeFormChild.js");
const { joinAssociationForm } = require("./joinAssociationForm/joinAssociationForm.js");

module.exports = {
    handleButtonClickForm(interaction) {
        console.log(interaction.customId, interaction.customId.includes("JoinRequest"));
        if(interaction.customId.includes("JoinRequest")) {
            joinAssociationForm(interaction);
        } else if(interaction.customId === "form_externalVerificationWelcome") {
            handleVerificationRequest(interaction);
            return;
        } else if (interaction.customId.toLowerCase().includes("welcome")) {
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