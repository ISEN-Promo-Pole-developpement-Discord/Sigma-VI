// [Guild ID] => {adminLog: [Channel ID], ioLog: [Channel ID], userLog: [Channel ID]}
var guildLogMap = new Map();

const {logAdminChannelName, logIoChannelName, logUserChannelName} = require("../../config-core.json");

function getGuildLogChannel(guild, type) {
    if (!guildLogMap.has(guild.id)) {
        let adminLogChannel = guild.channels.cache.find(channel => channel.name === logAdminChannelName);
        let ioLogChannel = guild.channels.cache.find(channel => channel.name === logIoChannelName);
        let userLogChannel = guild.channels.cache.find(channel => channel.name === logUserChannelName);
        guildLogMap.set(guild.id, {admin: adminLogChannel, io: ioLogChannel, user: userLogChannel});
    }
    return guildLogMap.get(guild.id)[type];
}

function objectClassDataToFields(object) {
    fields = [];
    if(object.joinedTimestamp) fields.push({name: "Created", value: `<t:${Math.floor(object.createdTimestamp)}:f>`, inline: true});
    if(object.updatedTimestamp) fields.push({name: "Updated", value: `<t:${Math.floor(object.updatedTimestamp)}:f>`, inline: true});
    if(object.deletedTimestamp) fields.push({name: "Deleted", value: `<t:${Math.floor(object.deletedTimestamp)}:f>`, inline: true});
    if(object.joinedTimestamp) fields.push({name: "Joined", value: `<t:${Math.floor(object.joinedTimestamp)}:f>`, inline: true});
    if(object.displayName) fields.push({name: "Name", value: object.displayName, inline: true});
    if(object.name) fields.push({name: "Name", value: object.name, inline: true});
    if(object.nickname) fields.push({name: "Nickname", value: object.nickname, inline: true});
    if(object.id) fields.push({name: "ID", value: object.id, inline: true});
    if(object.url) fields.push({name: "URL", value: `[Object URL](${object.url})`, inline: true});
    if(object.avatarURL) fields.push({name: "Avatar", value: object.displayAvatarURL(), inline: true});
    if(object.position) fields.push({name: "Position", value: object.position.toString(), inline: true});
    if(object.type){
        if(typeof object.type === "string") fields.push({name: "Type", value: object.type, inline: true});
        else if(object.type.toString) fields.push({name: "Type", value: object.type.toString(), inline: true});
    }
    if(object.description) fields.push({name: "Description", value: object.description, inline: true});
    if(object.hexColor) fields.push({name: "hexColor", value: object.hexColor, inline: true});
    if(object.displayHexColor) fields.push({name: "Display Color", value: object.displayHexColor, inline: true});
    if(object.parentId) fields.push({name: "Parent ID", value: object.parentId, inline: true});
    if(object.ownerId) fields.push({name: "Owner ID", value: object.ownerId, inline: true});
    if(object.animated) fields.push({name: "Animated", value: object.animated ? "True" : "False", inline: true});
    if(object.author) fields.push({name: "Author", value: `<@${object.author.id}>`, inline: true});
    if(object.inviter) fields.push({name: "Inviter", value: `<@${object.inviter.id}>`, inline: true});
    if(object.creatorId) fields.push({name: "Creator ID", value: object.creatorId, inline: true});
    if(object.identifier) fields.push({name: "Identifier", value: object.identifier, inline: true});
    if(object.reason) fields.push({name: "Reason", value: object.reason, inline: true});
    if(object.roles){
        rolesString = "";
        for(role of object.roles.cache.values()) {
            rolesString += `- ${role.toString()}\n`;
        }
        fields.push({name: "Roles", value: rolesString, inline: true});
    }
    if(object.communicationDisabledUntilTimestamp) fields.push({name: "Communication Disabled Until", value: `<t:${Math.floor(object.communicationDisabledUntilTimestamp)}:f>`, inline: true});
    if(object.premiumSinceTimestamp) fields.push({name: "Premium Since", value: `<t:${Math.floor(object.premiumSinceTimestamp)}:f>`, inline: true});
    if(object.userCount) fields.push({name: "User Count", value: object.userCount, inline: true});
    if(object.scheduledStartTimestamp) fields.push({name: "Scheduled Start", value: `<t:${Math.floor(object.scheduledStartTimestamp)}:f>`, inline: true});
    if(object.scheduledEndTimestamp) fields.push({name: "Scheduled End", value: `<t:${Math.floor(object.scheduledEndTimestamp)}:f>`, inline: true});
    if(object.uses) fields.push({name: "Uses", value: object.uses, inline: true});
    if(object.maxUses) fields.push({name: "Max Uses", value: object.maxUses, inline: true});
    if(object.expiresTimestamp) fields.push({name: "Expires", value: `<t:${Math.floor(object.expiresTimestamp)}:f>`, inline: true});
    if(object.maxAge) fields.push({name: "Max Age", value: object.maxAge, inline: true});
    if(object.archived){
        fields.push({name: "Archived", value: object.archived ? "True" : "False", inline: true});
        fields.push({name: "Archived At", value: `<t:${Math.floor(object.archivedTimestamp)}:f>`, inline: true});
    }
    if(object.muted) fields.push({name: "Muted", value: object.muted ? "True" : "False", inline: true});
    if(object.mutedTimestamp) fields.push({name: "Muted At", value: `<t:${Math.floor(object.mutedTimestamp)}:f>`, inline: true});
    if(object.locked) fields.push({name: "Locked", value: object.locked ? "True" : "False", inline: true});
    if(object.members) {
        if(object.members.cache) fields.push({name: "Members", value: object.members.cache.size.toString(), inline: true});
        else fields.push({name: "Members", value: object.members.size.toString(), inline: true});
    }
    if(object.rateLimitPerUser) fields.push({name: "Rate Limit Per User", value: object.rateLimitPerUser, inline: true});
    if(object.packId) fields.push({name: "Pack ID", value: object.packId, inline: true});
    if(object.unicodeEmoji) fields.push({name: "Unicode Emoji", value: unicodeEmoji, inline: true});
    if(object.channel) fields.push({name: "Channel", value: `<#${object.channel.id}>`, inline: true});
    if(object.toString && !object.content) fields.push({name: "Preview", value: object.toString(), inline: true});

    //removed empty strings and reduce field lentgh to 1000
    for(let i = 0; i < fields.length; i++) {
        if(fields[i].value === "") {
            fields.splice(i, 1);
            i--;
        }
        else if(fields[i].value.length > 1000) {
            fields[i].value = fields[i].value.substring(0, 1000);
            fields[i].value += "...";
        }
    }

    return fields;
}

function objectUpdateGetChangesFields(oldObject, newObject) {
    let fields = [];
    
    for(let key of Object.keys(oldObject)) {
        if(oldObject[key] !== newObject[key]) {
            const keyMajor = key.charAt(0).toUpperCase() + key.slice(1);
            if(typeof oldObject[key] == "string" || typeof oldObject[key] == "number" || typeof oldObject[key] == "boolean"){
                if(key.toLowerCase().includes("edited") || key.toLowerCase().includes("identifier")) break;
                if(key.toLowerCase().includes("timestamp")) fields.push({name: `${keyMajor} updated`, value: `<t:${Math.floor(oldObject[key])}:f> -> <t:${Math.floor(newObject[key])}:f>`, inline: false});
                else if(key.toLowerCase().includes("color")) fields.push({name: `${keyMajor} updated`, value: `${oldObject.hexColor} -> ${newObject.hexColor}`, inline: false});
                else if(key.toLowerCase().includes("content")){
                    fields.push({name: `Content before`, value: oldObject[key], inline: false});
                    fields.push({name: `Content after`, value: newObject[key], inline: false});
                } else fields.push({name: `${keyMajor} updated`, value: `${oldObject[key]} -> ${newObject[key]}`, inline: false});
            }
        }
    }

    if(oldObject.permissions){
        let updatedPermissions = null;
        if (!oldObject.permissions.equals(newObject.permissions)) {
            updatedPermissions = new Array();
            const oldPerms = oldObject.permissions.toArray()
            const newPerms = newObject.permissions.toArray();
            for (let i=0; i<newPerms.length; i++) {
                if (!oldPerms.includes(newPerms[i])) {
                    updatedPermissions = updatedPermissions.concat({value: newPerms[i], added: true});
                }
            }
    
            for (let i=0; i<oldPerms.length; i++) {
                if (!newPerms.includes(oldPerms[i])) {
                    updatedPermissions = updatedPermissions.concat({value: oldPerms[i], added: false});
                }
            }
        }
        if(updatedPermissions){
            const permsText = updatedPermissions.map(x => {return x.added ? `+ ${x.value.replaceAll("_", " ")}` : `- ${x.value.replaceAll("_", " ")}`});
            fields = fields.concat([{name: "Permissions updated", value: `\`\`\`md\n${permsText.join("\n")}\n\`\`\``, inline: false}]);
        }
    }

    //c'est Maxime
    /*
    if(oldObject.permissionOverwrites){
        if (!oldObject.permissionOverwrites.cache.equals(newObject.permissionOverwrites.cache)){
            let permissionChanged = new Array();
            
            newObject.permissionOverwrites.cache.forEach((newPerms, snowflake) => {
                const oldPerms = oldObject.permissionOverwrites.cache.get(snowflake);
                if(!oldPerms.allow.equals(newPerms.allow) || !oldPerms.deny.equals(newPerms.deny)){
                    permissionChanged = permissionChanged.concat([{value: newPerms, added: false}]);
                }
            });
            console.log(permissionChanged);
        }
        
    }
    */

    


    return fields;
}

module.exports = {
    getGuildLogChannel,
    objectClassDataToFields,
    objectUpdateGetChangesFields
}