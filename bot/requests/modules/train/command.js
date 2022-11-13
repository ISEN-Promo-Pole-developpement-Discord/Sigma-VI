const { SlashCommandBuilder, GuildVerificationLevel } = require('discord.js');
const CORE = require("./core");
const {getDatesFromString} = require('../../processors/getAbsoluteDate.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('train')
        .setDescription('Permet de rien faire pour l"instant')
        .addStringOption(option =>
            option.setName('villedépart')
            .setDescription('le nom de la ville de départ')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('villearrive')
            .setDescription('le nom de la ville d\'arrivée')
            .setRequired(true)
        )

,

    async execute(interaction){
        let defering = interaction.deferReply();
        let author = interaction.user;
        let villeD = interaction.options.getString('villedépart');
        console.log(villeD);
        let villeA = interaction.options.getString('villearrive');
        console.log(villeA);
        interaction.channel.send(`Ville de départ  : ${villeD} et ville d'arrivée ${villeA}\n`);
}}