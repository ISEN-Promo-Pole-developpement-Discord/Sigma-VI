const { InteractionType, ComponentType } = require("discord.js")
const { handleFormResponse } = require("../forms/formManager.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    execute(interaction) {
        /**
         * Emitted when an interaction is created.
         * @param {Interaction} interaction The interaction that got created
         * @event interactionCreate
         * @returns {Promise<void>}
         */

        if (interaction.type === InteractionType.MessageComponent) {
            if (interaction.componentType === ComponentType.SelectMenu) {
                for (v of interaction.values) {
                    if (v.toLowerCase().includes("form")) {
                        handleFormResponse(interaction);
                        return;
                    }
                }
            }
        }
    }
}