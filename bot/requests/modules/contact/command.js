const { SlashCommandBuilder } = require('discord.js');
const CORE = require("./core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contact')
        .setDescription('Annuaire dynamique de l\'ISEN')
        .addSubcommand(subcommand =>
            subcommand
            .setName('list')
            .setDescription('Permet de récupérer la liste des contacts')
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('get')
            .setDescription('Permet de rechercher un contact à partir de son nom ou d\'un ou plusieurs mots clés')
            .addStringOption(option => option.setName('search').setDescription('La recherche').setRequired(true))
        ),
    async execute(interaction){
        var defering = interaction.deferReply();
        var subcommand = interaction.options.getSubcommand();
        var search = null;
        switch(subcommand){
            case 'list':
                search = 'list';
                break;
            case 'get':
                search = interaction.options.getString('search');
                break;
        }

        var reply = await CORE(search);
        await defering;
        interaction.editReply(reply);
    }
};