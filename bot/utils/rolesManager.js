global.config = require("../config.json");

  async function assignRoles(member, guild, roles)
{
    await guild.roles.fetch();
    var rolesPending = [];

    for (let role of roles)
    {
        var targetRoleString = role.toLowerCase().replace(/ /g, "");
        var roleFound = false;
        for(let guildRole of guild.roles.cache.values())
        {
            var guildRoleString = guildRole.name.toLowerCase().replace(/ /g, "");
            if (guildRoleString === targetRoleString)
            {
                if(global.debug) console.log("> Role found: " + guildRole.name);
                rolesPending.push(member.roles.add(guildRole));
                roleFound = true;
            }
        }
        if (!roleFound)
        {
            if(global.debug) console.log("> Role not found: " + role);
        }
    }
    await Promise.all(rolesPending);
}

async function assignVerifiedRole(user, guild)
{
    let roleName = global.config.verifiedRoleName;
    if (guild.roles.cache.find(r => r.name === roleName))
    {
        if (global.debug) console.log("> Role found");
        await guild.members.cache.get(user.id).roles.add(guild.roles.cache.find(r => r.name === roleName))
    }
    else
    {
        if (global.debug) console.log("> Role not found");
        let verifiedRole = await guild.roles.create()
            .then(console.log("> Verified Role created"))
            .catch(console.error);
        await verifiedRole.edit(
            {
                name: roleName,
                color: "#ffffff",
            });

        await guild.members.cache.get(user.id).roles.add(guild.roles.cache.find(r => r.name === roleName));
    }
}

module.exports = {
    assignRoles,
    assignVerifiedRole,
}