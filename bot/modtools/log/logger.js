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

/**
 * 
 * @param {Guild} guild - guild where the action occurred
 * @param {Object} object - object that got involved
 */
async function getActionAuthor(guild, object) {
    let author = null;
    await guild.fetchAuditLogs()
    .then(audit => {
        audit.entries.forEach((entry, snowflake) => {
            if (entry.target.id) {
                if (entry.target.id === object.id && author === null) {
                    author = entry.executor;
                }
            }
        })
    }).catch(console.error);

    return author;
}


async function getLastMessagePinned(guild,channel) {
    let message = null;
    console.log(`\n object :  ${channel} \n`);
    console.log(`\n type : ${typeof channel}\n\n\n`);
    let object=channel.messages.fetchPinned()
        .then(ObjMessage => {
            for(let i=1;i<=ObjMessage.size;i++){
                keyz=ObjMessage.prototype.keys();
                console.log(typeof keyz)
            }
        }
        );
         
    return message
    }



function objectClassDataToFields(object) {
    fields = [];
    let objectHerited = object;
    while (objectHerited !== null) {
        for(let key of Object.getOwnPropertyNames(objectHerited)) {
            const keyMajor = key.charAt(0).toUpperCase() + key.slice(1);
            if (object[key] !== null) {
                try {
                    if(typeof object[key] == "string" || typeof object[key] == "number" || typeof object[key] == "boolean" || object[key].toString){
                        if(key.toLowerCase().includes("timestamp")) fields.push({name: keyMajor, value: `<t:${Math.floor(object[key]/1000)}:f>`, inline: true});
                        else if(key.toLowerCase().includes("color")) fields.push({name: keyMajor, value: `${object.hexColor}`, inline: true});
                        else if(key.toLowerCase().includes("content") && typeof object[key] == "string"){
                            fields.push({name: `Content`, value: object[key], inline: true});
                        } else if(key.toLowerCase().includes("url")) fields.push({name: "URL", value: `[Object URL](${object.url})`, inline: true});
                        else fields.push({name: keyMajor, value: `${object[key]}`, inline: true});
                    }  else if (key === "avatarURL") {
                        fields.push({name: "Avatar", value: object.displayAvatarURL(), inline: true});
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }

        objectHerited = Object.getPrototypeOf(objectHerited);
    }

    if (object.roles) {
        let rolesString = "";
        for(role of object.roles.cache.values()) {
            rolesString += `- ${role.toString()}\n`;
        }
        fields.push({name: "Roles", value: rolesString, inline: true});
    }

    if(object.toString && !object.content) fields.push({name: "Preview", value: object.toString(), inline: true}); 
    //removed empty strings and reduce field lentgh to 1000
    for(let i = 0; i < fields.length; i++) {
        if(fields[i].value === "" ||
        fields[i].value.includes("object") || fields[i].value.includes("function") || fields[i].value.includes("return") ||
        fields[i].name.includes("_") || fields[i].value.includes("async") || fields[i].name.includes("At") ||
        fields[i].name.includes("able") || fields[i].value.includes("undefined") || fields[i].name.includes("Deleted") || fields[i].name.includes("Partial") ||
        fields[i].name.toLowerCase().includes("guild")) {
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

    /*
    fields = [];
    if(object.createdTimestamp) fields.push({name: "Created", value: `<t:${Math.floor(object.createdTimestamp/1000)}:f>`, inline: true});
    if(object.updatedTimestamp) fields.push({name: "Updated", value: `<t:${Math.floor(object.updatedTimestamp/1000)}:f>`, inline: true});
    if(object.deletedTimestamp) fields.push({name: "Deleted", value: `<t:${Math.floor(object.deletedTimestamp/1000)}:f>`, inline: true});
    if(object.joinedTimestamp) fields.push({name: "Joined", value: `<t:${Math.floor(object.joinedTimestamp/1000)}:f>`, inline: true});
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
    
        if(object.guild){
        for(role of object.roles.cache.values() ) {
            rolesString += `- ${role.toString()}\n`;
        }
    }
        fields.push({name: "Roles", value: rolesString, inline: true});
    }
//}
    if(object.communicationDisabledUntilTimestamp) fields.push({name: "Communication Disabled Until", value: `<t:${Math.floor(object.communicationDisabledUntilTimestamp/1000)}:f>`, inline: true});
    if(object.premiumSinceTimestamp) fields.push({name: "Premium Since", value: `<t:${Math.floor(object.premiumSinceTimestamp/1000)}:f>`, inline: true});
    if(object.userCount) fields.push({name: "User Count", value: object.userCount, inline: true});
    if(object.scheduledStartTimestamp) fields.push({name: "Scheduled Start", value: `<t:${Math.floor(object.scheduledStartTimestamp/1000)}:f>`, inline: true});
    if(object.scheduledEndTimestamp) fields.push({name: "Scheduled End", value: `<t:${Math.floor(object.scheduledEndTimestamp/1000)}:f>`, inline: true});
    if(object.uses) fields.push({name: "Uses", value: object.uses, inline: true});
    if(object.maxUses) fields.push({name: "Max Uses", value: object.maxUses, inline: true});
    if(object.expiresTimestamp) fields.push({name: "Expires", value: `<t:${Math.floor(object.expiresTimestamp/1000)}:f>`, inline: true});
    if(object.maxAge) fields.push({name: "Max Age", value: object.maxAge, inline: true});
    if(object.archived){
        fields.push({name: "Archived", value: object.archived ? "True" : "False", inline: true});
        fields.push({name: "Archived At", value: `<t:${Math.floor(object.archivedTimestamp/1000)}:f>`, inline: true});
    }
    if(object.muted) fields.push({name: "Muted", value: object.muted ? "True" : "False", inline: true});
    if(object.mutedTimestamp) fields.push({name: "Muted At", value: `<t:${Math.floor(object.mutedTimestamp/1000)}:f>`, inline: true});
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
*/

function objectUpdateGetChangesFields(oldObject, newObject) {

    let fields = [];
    let objectHerited = oldObject;
    while (objectHerited !== null) {
        for(let key of Object.getOwnPropertyNames(objectHerited)) {
            const keyMajor = key.charAt(0).toUpperCase() + key.slice(1);
            if (oldObject[key] !== null && newObject[key] !== null) {
                try {
                    if(oldObject[key] !== newObject[key] && !fields.map(x => {return x.name}).includes(`${keyMajor} updated`)) {
                        if(typeof oldObject[key] == "string" || typeof oldObject[key] == "number" || typeof oldObject[key] == "boolean"){
                            if(key.toLowerCase().includes("timestamp")) fields.push({name: `${keyMajor} updated`, value: `<t:${Math.floor(oldObject[key]/1000)}:f> -> <t:${Math.floor(newObject[key]/1000)}:f>`, inline: false});
                            else if(key.toLowerCase().includes("color")) fields.push({name: `${keyMajor} updated`, value: `${oldObject.hexColor} -> ${newObject.hexColor}`, inline: false});
                            else if(key.toLowerCase().includes("content")){
                                if (!fields.map(x => {return x.name}).includes(`Content before`)) {
                                    fields.push({name: `Content before`, value: oldObject[key], inline: false});
                                    fields.push({name: `Content after`, value: newObject[key], inline: false});
                                }
                            } else fields.push({name: `${keyMajor} updated`, value: `${oldObject[key]} -> ${newObject[key]}`, inline: false});
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }

        objectHerited = Object.getPrototypeOf(objectHerited);
    };

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

module.exports = {
    getGuildLogChannel,
    objectClassDataToFields,
    objectUpdateGetChangesFields,
    getActionAuthor,
    getLastMessagePinned
}