const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require("discord.js");
const { FormsManager } = require("../../bdd/classes/formsManager.js");
const { responseFromWelcomeProcess } = require("./welcomeProcessManager.js");
const { getSelectMenusFromJSON } = require("../../utils/formHelper.js");

/**
 * Welcome process tasks list
 * @type {Object}
 * @property {Array<Object>} tasks The tasks list
 * @property {String} tasks.name The task name
 * @property {Number} tasks.step The task step
 * @property {String} tasks.description The task description
 * @property {Object} tasks.toAsk The task data to ask
 * @property {String} tasks.toAsk.id The task interaction id
 * For a modal interaction, the task data to ask must be an object with the following properties:
 * @property {String} tasks.toAsk.title The task interaction title
 * @property {Array<Object>} tasks.toAsk.fields The task interaction fields
 * @property {String} tasks.toAsk.fields.id The task interaction field id
 * @property {String} tasks.toAsk.fields.label The task interaction field label
 * @property {String} tasks.toAsk.fields.type The task interaction field type
 * For a select menu interaction, the task data to ask must be an object with the following properties:
 * @property {String} tasks.toAsk.label The task interaction label
 * @property {Array<Object>} tasks.toAsk.options The task interaction options
 * @property {String} tasks.toAsk.options.value The task interaction option value
 * @property {String} tasks.toAsk.options.label The task interaction option label
 * @property {String} tasks.toAsk.options.description The task interaction option description
 * @property {String} tasks.toAsk.options.emoji The task interaction option emoji
 */
const welcomeProcess = require("./welcomeProcess.json");

/**
 * Select menus data to collect
 * @type {Object}
 */
const welcomeFormData = require("./welcomeForm.json");

/**
 * Fetch a task step from its name
 * @param {*} name  The task name
 * @returns {Object|null} The task step or null if not found
 */
function searchStepFromName(name) {
    if(typeof name !== "string") return null;
    for (const step of welcomeProcess.tasks) {
        if (step.name === name) {
            return step;
        }
    }

    return null;
}

function handleWelcomeButtonClick(interaction) {

    if (interaction.customId.includes("launch") || interaction.customId.includes("modify")) {
        for (const task of welcomeProcess.tasks) {
            if (task.toAsk.id) {
                if (task.toAsk.id.includes(interaction.customId.slice(7))) {
                    const modal = new ModalBuilder()
                        .setCustomId(`${task.toAsk.id}`)
                        .setTitle(`${task.toAsk.title}`);

                    let rows = new Array();

                    for (const field of task.toAsk.fields) {
                        rows.push(new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId(`${field.id}`)
                                .setLabel(`${field.label}`)
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(task.toAsk.id === "welcomeForm_checkMail" ? 6 : 64)
                        ));
                    }

                    modal.setComponents(rows);
                    interaction.showModal(modal);
                    
                    return;
                }
            }
        }
    }
    else if (Object.values(welcomeFormData).map((x) => {return x.menu.value}).includes(interaction.customId)){
            responseFromWelcomeProcess(-1, interaction);
    } else if (interaction.customId.split("_").at(-1) === "retry") {
        FormsManager.getForm(interaction.guild.id, interaction.channel.id).then(async (form) => {
            await FormsManager.deleteForm(form.form_id);
        })
    } else {
        const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));

        if (!interaction.message.editedAt) {
            (async () => {
                await interaction.deferUpdate();
                responseFromWelcomeProcess(step.step, interaction);
            })();
        }
    }
}


async function handleWelcomeFormMenuResponse(interaction) {
    const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));
    const id = interaction.values[0].split("_").at(-2);
    const value = interaction.values[0].split("_").at(-1);

    await interaction.deferUpdate();

    const form = await FormsManager.getForm(interaction.guild.id, interaction.channel.id);
    if(!form){
        console.log(">> form not found (welcomeForm)");
        return;
    }
    const formAnswers = await form.getFields();
    var formCompletedFields = Object.keys(formAnswers);

    await form.registerField(id, value);

    var menuSelectorIds = new Array();
    for(const actionRow of interaction.message.components) {
        for(const selectMenu of actionRow.components) {
            menuSelectorIds.push(selectMenu.customId);
        }
    }

    var notCompletedMenuFields = new Array();
    for (const menuSelectorId of menuSelectorIds) {
        var menuSelectorFieldName = menuSelectorId.split("_").at(-1);
        if(!formCompletedFields.includes(menuSelectorFieldName)) {
            notCompletedMenuFields.push(menuSelectorFieldName);
        }
    }

    if (step.toAsk.type === "welcomeMenus") {
        if (formCompletedFields.includes(id)) {
            const messages = await interaction.channel.messages.fetch();
            let stepMessages = []
            messages.forEach((msg, snowflake) => {
                const msgStep = searchStepFromName(msg.content.split("\n")[0].slice(2, -2));
                if (msgStep) {
                    if (msgStep.toAsk.type === "welcomeMenus") {
                        stepMessages.push(msg);
                    }
                }
            });

            stepMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            let msgUpdated = false;

            for (let i=0;i<stepMessages.length;i++) {
                if (stepMessages.length > 1) {
                    if (msgUpdated) {
                        await stepMessages[i].delete();
                    }
                    if (stepMessages[i].id === interaction.message.id) {
                        if (stepMessages[i+1]) {
                            if (interaction.message.components.length === 1) {
                                let nextMenuSelectorIds = new Array();
                                for(const actionRow of stepMessages[i+1].components) {
                                    for(const selectMenu of actionRow.components) {
                                        nextMenuSelectorIds.push(selectMenu.customId);
                                    }
                                }
                                const newFormAnswers = await form.getFields();

                                for (const nextMenuSelectorId of nextMenuSelectorIds) {
                                    const nextMenuSelectorFieldName = nextMenuSelectorId.split("_").at(-1);
                                    if (newFormAnswers[nextMenuSelectorFieldName]) {
                                        delete newFormAnswers[nextMenuSelectorFieldName];
                                    }
                                }
                                await form.setFields(newFormAnswers);

                                const next = getSelectMenusFromJSON("welcomeForm", interaction.values[0], welcomeFormData);
                                if (next) {
                                    await stepMessages[i+1].edit({
                                        content: `**${step.name}**\nVous avez encore des informations à remplir ci-dessous.`,
                                        components: next
                                    });
                                    i++;
                                } else {
                                    await stepMessages[i+1].delete();
                                    responseFromWelcomeProcess(step.step, interaction);
                                }
                                msgUpdated = true;
                            }
                        }
                    }
                }
            }
        }
    }

    if(notCompletedMenuFields.length == 1) {
        if(notCompletedMenuFields[0] == id) {
            responseFromWelcomeProcess(step.step, interaction);
        }
    }
}

async function handleWelcomeFormResponse(interaction) {
    let data = {}
    for (field of interaction.fields.components) {
        data[field.components[0].customId] = field.components[0].value.trim();
    }

    const step = searchStepFromName(interaction.message.content.split("\n")[0].slice(2, -2));

    if (interaction.customId.includes("checkMail")) {
        const form = await FormsManager.getForm(interaction.guild.id, interaction.channel.id)
        if(!form){
            console.log(">> form not found (checkMail)");
            return;
        }
        form.checkVerificationCode(Object.values(data)[0]).then(async (codeIsValid) => {
            if (codeIsValid) {
                try{
                    await interaction.update({
                        content: `**${step.name}**\n✅ Votre adresse e-mail a bien été vérifiée. Merci.`,
                        components: []
                    });
                }catch(e){
                    console.log(e);
                }

                const fields = await form.getFields();

                const surname = fields.nom;
                const name = fields.prenom;
                let mail = fields.mail;
                
                if (!mail) {
                    mail = `${name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll(" ","-")}.${surname.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll(" ","-")}`;
                    if (fields.profilGeneral !== "EtudiantISEN") {
                        mail = `${mail}@yncrea.fr`;
                    } else {
                        mail = `${mail}@isen.yncrea.fr`;
                    }
                }
                
                await form.registerField("mail", mail);
                await form.registerField("mailValidated", true);
                responseFromWelcomeProcess(step.step, interaction);
            } else {
                await interaction.update({
                    content: `**${step.name}**\n❌ Vous venez de rentrer le mauvais code. Veuillez réessayer.`,
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`launch_${interaction.customId}`)
                                .setLabel(`Ressaisir le code reçu par e-mail`)
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(false)
                        )
                    ]
                });
                const form = await FormsManager.getForm(interaction.guild.id, interaction.channel.id);

                if(!form){
                    console.log(">> form not found (handleWelcomeFormResponse)");
                    return;
                }
                await form.registerField("mailValidated", false);
            }
        });
    } else {
        if (!interaction.message.editedAt) {
            responseFromWelcomeProcess(step.step, interaction);
        }

        FormsManager.getForm(interaction.guild.id, interaction.channel.id).then(async (form) => {
            for (key of Object.keys(data)) {
                await form.registerField(key.split("_").at(-1), data[key]);
            }
        });
        
        await interaction.update({
            content: `**${step.name}**\n> *${Object.values(data).join("*\n> *")}*\nModifiez vos réponses en cliquant sur le bouton "Modifier" ci-dessous.`,
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`launch_${interaction.customId}`)
                        .setLabel(`Formulaire rempli`)
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId(`modify_${interaction.customId}`)
                        .setLabel(`Modifier`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false)
                )
            ]
        });
    }
}

module.exports = {
    handleWelcomeButtonClick,
    handleWelcomeFormMenuResponse,
    handleWelcomeFormResponse
}