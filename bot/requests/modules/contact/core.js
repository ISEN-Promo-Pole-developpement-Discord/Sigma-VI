const contacts = require("./contact.js");
const Discord = require("discord.js");
const filterBlackListedWords = require("../../processors/filterBlackListedWords.js");

async function coreProcess(string){
    var embed = new Discord.EmbedBuilder();
    embed.setColor(0x6666CC);

    if(string.toLowerCase().includes("list")){
        /** @type {Array<String>}*/
        let contactsList = contacts.getContactsList();
        embed.setTitle("Liste des contacts");

        // Split in two columns and add to embed
        let half = Math.ceil(contactsList.length / 2);

        let firstColumn = contactsList.slice(0, half);
        let firstColumnFirstLetter = firstColumn.map(contact => contact[1][0])[0];
        let firstColumnLastLetter = firstColumn.map(contact => contact[1][0])[firstColumn.length - 1];
        firstColumn = firstColumn.map(contact => contact[0] + " " + contact[1].toUpperCase());

        let secondColumn = contactsList.slice(half);
        let secondColumnFirstLetter = secondColumn.map(contact => contact[1][0])[0];
        let secondColumnLastLetter = secondColumn.map(contact => contact[1][0])[secondColumn.length - 1];
        secondColumn = secondColumn.map(contact => contact[0] + " " + contact[1].toUpperCase());

        embed.addFields(
            {
                name: `${firstColumnFirstLetter}-${firstColumnLastLetter}`,
                value: firstColumn.join("\n"),
                inline: true
            },
            {
                name: `${secondColumnFirstLetter}-${secondColumnLastLetter}`,
                value: secondColumn.join("\n"),
                inline: true
            }
        );
    } else {
        string = filterKeys(string);
        let contact = contacts.searchContact(string);
        if(contact === null)
            return "Aucun contact trouvé. Veuillez réessayer ou vous référer à la liste des contacts.";
        embed.setTitle(contact.getFullName());
        embed.setDescription(contact.getFunctions().join("\n"));
        embed.addFields(await contact.getFields());
    }
    let icon = "icon.png";
    let iconAttachment = new Discord.AttachmentBuilder("requests/modules/contact/" + icon, icon);
    embed.setAuthor({name: `Annuaire\nDynamique`, iconURL: 'attachment://'+icon});
    return {embeds: [embed], files: [iconAttachment]};
}

/**
 * Take a string and return it without the keywords of the module
 * @param {String} string the string to filter
 */
function filterKeys(string){
    let keys = Object.keys(require("./#keys.json"));
    for(let key of keys){
        string = string.replaceAll(key, "");
    }
    string = filterBlackListedWords(string);
    return string;
}

module.exports = coreProcess;