const { MessageEmbed } = require('discord.js');

/**
 * Creates a new embed from the given data
 * @param {*} data The data to create the embed from
 * @param {string} data.title The title of the embed
 * @param {string} data.description The description of the embed 
 * @param {string} data.url The url of the embed
 * @param {string} data.color The color of the embed (hex)
 * @param {number} data.timestamp The timestamp of the embed (unix)
 * @param {string} data.image The image of the embed
 * @param {string} data.image.url The url of the image
 * @param {string} data.image.proxy_url The proxy url of the image
 * @param {number} data.image.height The height of the image
 * @param {number} data.image.width The width of the image
 * @param {string} data.thumbnail The thumbnail of the embed
 * @param {string} data.thumbnail.url The url of the thumbnail
 * @param {string} data.thumbnail.proxy_url The proxy url of the thumbnail
 * @param {number} data.thumbnail.height The height of the thumbnail
 * @param {number} data.thumbnail.width The width of the thumbnail
 * @param {string} data.author The author of the embed
 * @param {string} data.author.name The name of the author
 * @param {string} data.author.url The url of the author
 * @param {string} data.author.icon_url The icon url of the author
 * @param {string} data.author.proxy_icon_url The proxy icon url of the author
 * @param {string} data.footer The footer of the embed
 * @param {string} data.footer.text The text of the footer
 * @param {string} data.footer.icon_url The icon url of the footer
 * @param {string} data.footer.proxy_icon_url The proxy icon url of the footer
 * @param {string} data.fields The fields of the embed
 * @param {string} data.fields.name The name of the field
 * @param {string} data.fields.value The value of the field
 * @param {boolean} data.fields.inline Whether the field is inline or not
 * @returns {MessageEmbed}
 */
function newEmbed(data) {
    let embed = new MessageEmbed();
    if(data.title) embed.setTitle(data.title);
    if(data.description) embed.setDescription(data.description);
    if(data.url) embed.setURL(data.url);
    if(data.color) embed.setColor(data.color);
    else embed.setColor("#1d1d1b");
    if(data.timestamp) embed.setTimestamp(data.timestamp);
    if(data.image) embed.setImage(data.image.url);
    if(data.thumbnail) embed.setThumbnail(data.thumbnail.url);
    if(data.author) embed.setAuthor({name: data.author.name, url: data.author.url, iconURL: data.author.icon_url});
    if(data.fields) embed.addFields(data.fields);
    if(data.footer) embed.setFooter({text: data.footer.text, iconURL: data.footer.icon_url});
    return embed;
}

module.exports = {
    newEmbed
};