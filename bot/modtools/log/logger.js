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
            if (object[key] !== null && object[key] !== undefined && !key.includes("_")) {
                try {
                    if(typeof object[key] == "string" || typeof object[key] == "number" || typeof object[key] == "boolean" || object[key].toString){
                        if(key.toLowerCase().includes("timestamp")) fields.push({name: keyMajor, value: `<t:${Math.floor(object[key]/1000)}:f>`, inline: true});
                        else if(key.toLowerCase().includes("color")) fields.push({name: keyMajor, value: `${object.hexColor}`, inline: true});
                        else if(key.toLowerCase().includes("content") && typeof object[key] == "string"){
                            fields.push({name: `Content`, value: object[key], inline: true});
                        } else{
                            fields.push({name: keyMajor, value: `${object[key]}`, inline: true});
                        }
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
            if (role.name !== "@everyone") {
                rolesString += `- ${role.toString()}\n`;
            }
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
        fields[i].name.toLowerCase().includes("guild") || fields[i].name.includes("Pending") || fields[i].name.includes("System") ||
        fields[i].name.includes("Username") || fields[i].name.includes("Discriminator") || fields[i].name.toLowerCase().includes("url") ||
        fields[i].name.includes("Type")) {
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

function getLogIcon(string, color){
    
}

module.exports = {
    getGuildLogChannel,
    objectClassDataToFields,
    objectUpdateGetChangesFields,
    getActionAuthor,
    getLastMessagePinned
}