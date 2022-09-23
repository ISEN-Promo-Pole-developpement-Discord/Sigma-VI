const { InteractionType, ComponentType } = require("discord.js")
const { handleButtonClickForm, handleFormResponse, handleMenuFormResponse } = require("../forms/formManager.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        /**
         * Emitted when an interaction is created.
         * @param {Interaction} interaction The interaction that got created
         * @event interactionCreate
         * @returns {Promise<void>}
         */

        if(interaction.type === InteractionType.ApplicationCommand){
            const command = global.client.commands.get(interaction.commandName);
	        if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
            }
            return;
        }

        if (interaction.type === InteractionType.MessageComponent) {
            if (interaction.componentType === ComponentType.Button) {
                if (interaction.customId.toLowerCase().includes("form")) {
                    handleButtonClickForm(interaction);
                    return;
                } else if(interaction.customId.toLowerCase().includes("asso")) {
                    handleButtonClickForm(interaction);
                    return;
                }
            } else if (interaction.componentType === ComponentType.SelectMenu) {
                if (interaction.customId.toLowerCase().includes("form")) {
                    handleMenuFormResponse(interaction);
                    return;
                }
            }
        } else if (interaction.type === InteractionType.ModalSubmit) {
            handleFormResponse(interaction);
            return;
        }

        interaction.reply({
            content: "Un problème est survenu. Veuillez contacter un administrateur.",
            ephemeral: true,
            fetchReply: true
        });
    }
}