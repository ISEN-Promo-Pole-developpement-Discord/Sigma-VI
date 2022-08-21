const { SlashCommandBuilder } = require('discord.js');
const CORE = require("./core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Permet de tester la connexion à une URL ou aux services de l\'ISEN.')
        .addStringOption(option => option.setName('url').setDescription('L\'URL à tester.').setRequired(false)),
    async execute(interaction){
        var defering = interaction.deferReply();
        var url = interaction.options.getString('url');
        var reply = await CORE(url, interaction.createdAt.getTime());
        await defering;
        interaction.editReply(reply);
    }
};