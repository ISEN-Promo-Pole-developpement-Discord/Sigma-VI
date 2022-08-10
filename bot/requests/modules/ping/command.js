const { SlashCommandBuilder } = require('discord.js');
const CORE = require("./core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Permet de tester la connexion à une URL ou aux services de l\'ISEN.')
        .addStringOption(option => option.setName('url').setDescription('L\'URL à tester.').setRequired(false)),
    async execute(interaction){
        interaction.deferReply();
        var url = interaction.getOption('url');
        var reply = await CORE(url, interaction.createdAt.getTime());
        interaction.reply(reply);
    }
};