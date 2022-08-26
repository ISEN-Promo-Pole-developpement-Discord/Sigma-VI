const { SlashCommandBuilder } = require('discord.js');
const CORE = require("./core");
const getDatesFromString = require('../../processors/getAbsoluteDate.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('planning')
        .setDescription('Permet de récupérer des événements depuis l\'ENT de l\'ISEN')
        .addSubcommand(subcommand =>
            subcommand
            .setName('next')
            .setDescription('Permet de récupérer le prochain événement à venir')
            .addStringOption(option => option.setName('recherche').setDescription('L\'événement à récupérer').setRequired(false))
            .addStringOption(option => option.setName('cible').setDescription('L\'utilisateur pour qui récupérer l\'événement').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('date')
            .setDescription('Permet de récupérer les événements à une date donnée')
            .addStringOption(option => option.setName('date').setDescription('La date pour laquelle récupérer les événements').setRequired(false))
            .addStringOption(option => option.setName('cible').setDescription('L\'utilisateur pour qui récupérer les événements').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('week')
            .setDescription('Permet de récupérer les événements de la semaine')
            .addStringOption(option => option.setName('date').setDescription('La date de début de la semaine').setRequired(false))
            .addStringOption(option => option.setName('cible').setDescription('L\'utilisateur pour qui récupérer les événements').setRequired(false))
        ),
    async execute(interaction){
        var defering = interaction.deferReply();
        var subcommand = interaction.options.getSubcommand();
        var author = interaction.user;
        var dates = null;
        var search = null;
        var target = null;

        var cible = interaction.options.getString('cible');
        var match = /<@!?(\d+)>/.exec(cible);
        if(match){
            target = interaction.client.users.get(match[0]);
        } else target = cible;

        var recherche = interaction.options.getString('recherche');
        if(recherche){
            search = recherche;
        }

        switch(subcommand){
            case 'next':
                if(!recherche) search = 'next';
                break;
            case 'date':
                var date = interaction.options.getString('date');
                if(date){
                    dates = getDatesFromString(date);
                    break;
                }
                dates = getDatesFromString('today');
                break;
            case 'week':
                var date = interaction.options.getString('date');
                if(date){
                    dates = getDatesFromString(date + " week");
                    break;
                }
                dates = getDatesFromString('week');
                break;
        }
        var reply = await CORE(author, dates, search, target);
        await defering;
        interaction.editReply(reply);
    }
};