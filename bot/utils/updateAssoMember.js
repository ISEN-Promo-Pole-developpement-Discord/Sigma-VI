const { UsersManager } = require("../bdd/classes/usersManager");
const { AssoRolesManager } = require("../bdd/classes/asso_rolesManager");
const { AssociationsManager } = require("../bdd/classes/associationsManager");
const { manageRoles } = require("../utils/rolesManager");
const assoConfig = require("../config-asso.json");

async function updateAssociationsMember(member, guild)
{
    // Verify if user is in DB
    if (UsersManager.getUser(member.id) === null) return null;

    // Fetch all asso_roles of the user
    let assoRoles = await AssoRolesManager.getAssoRolesFromUser(member.id);
    console.log(assoRoles);
    if (assoRoles === null) return;
    else
    {
        let addRolesArray = [];
        let removeRolesArray = [];
        let functionArray = [];

        // LOAD ASSO CONFIG VARS
        const memberRoleName = assoConfig.RolesName.memberRoleName;
        const managerRoleName = assoConfig.RolesName.managerRoleName;
        const treasurerRoleName = assoConfig.RolesName.treasurerRoleName;
        const vicePresidentRoleName = assoConfig.RolesName.vicePresidentRoleName;
        const presidentRoleName = assoConfig.RolesName.presidentRoleName;

        let sortedRoles = [];
        for (guildRole of guild.roles.cache.values())
            sortedRoles.push(guildRole.name);

        sortedRoles = sortedRoles.filter(role => role.startsWith("Asso - "));

        for (asso in assoRoles) {
            let asso_id = assoRoles[asso].asso_id;
            // Get Asso row in DB to get its name
            let currentAsso = await AssociationsManager.getAssociationsByID(asso_id);
            let assoName = "Asso - " + await currentAsso.getName();
            await addRolesArray.push(assoName);
            await functionArray.push(assoRoles[asso].status);

            sortedRoles = sortedRoles.filter(role => role !== assoName);
        }

        sortedRoles = sortedRoles.filter(role => role !== memberRoleName);
        sortedRoles = sortedRoles.filter(role => role !== managerRoleName);
        sortedRoles = sortedRoles.filter(role => role !== treasurerRoleName);
        sortedRoles = sortedRoles.filter(role => role !== vicePresidentRoleName);
        sortedRoles = sortedRoles.filter(role => role !== presidentRoleName);

        console.log(sortedRoles);
        for (sortedRole in sortedRoles) {
            await removeRolesArray.push(sortedRoles[sortedRole]);
        }

        let count = [0, 0, 0, 0, 0];
        for (let i=0; i<functionArray.length; i++) {
            switch (functionArray[i]) {
                case 0:
                    count[0]++;
                    break;
                case 1:
                    count[1]++;
                    break;
                case 2:
                    count[2]++;
                    break;
                case 3:
                    count[3]++;
                    break;
                case 4:
                    count[4]++;
                    break;
                default:
                    break;
            }
        }
        console.log(count);

        if (count[0] > 0)
            await addRolesArray.push(memberRoleName);
        else
            await removeRolesArray.push(memberRoleName);

        if (count[1] > 0)
            await addRolesArray.push(managerRoleName);
        else
            await removeRolesArray.push(managerRoleName);

        if (count[2] > 0)
            await addRolesArray.push(treasurerRoleName);
        else
            await removeRolesArray.push(treasurerRoleName);

        if (count[3] > 0)
            await addRolesArray.push(vicePresidentRoleName);
        else
            await removeRolesArray.push(vicePresidentRoleName);

        if (count[4] > 0)
            await addRolesArray.push(presidentRoleName);
        else
            await removeRolesArray.push(presidentRoleName);

        await manageRoles(member, guild, removeRolesArray, 1);
        await manageRoles(member, guild, addRolesArray, 0);

        for (asso in assoRoles)
            await manageAssoCatPerms(member, member.guild, assoRoles[asso].asso_id);
    }
}

async function manageAssoCatPerms(member, guild, associationID)
{
    let channelsToModify = await getAssoRespoChannels(member, member.guild, associationID);

    if (await (await AssoRolesManager.getAssoRoles(member.id, associationID)).getStatus() === 0) {
        for (channel of channelsToModify)
            channel.permissionOverwrites.delete(member.id);
        return;
    }

    for (channel of channelsToModify) {
        await channel.permissionOverwrites.create(member, {
            ViewChannel: true,
        });
    }
}

async function getAssoRespoChannels(member, guild, associationID)
{
    let respoChannelsObj = [];

    let guildChannels = guild.channels.cache.values();
    let channelsToModify = ["responsables", "bureau"];

    let assoCat = null;
    for (category of guildChannels) {
        let association = await AssociationsManager.getAssociationsByID(associationID);
        if(category.name.toLowerCase() === (await association.getName()).toLowerCase())
            assoCat = category.id;
    }

    for (let i=0; i<channelsToModify.length; i++)
    {
        guildChannels = member.guild.channels.cache.values();
        for (channel of guildChannels) {
            if ((channel.name.toLowerCase() === channelsToModify[i]) && (channel.parentId === assoCat)) {
                respoChannelsObj.push(channel);
            }
        }
    }
    return respoChannelsObj;
}

module.exports = {
    updateAssociationsMember,
}