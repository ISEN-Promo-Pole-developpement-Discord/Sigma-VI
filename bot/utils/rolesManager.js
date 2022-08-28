global.config = require("../config.json");

async function assignRoles(user, guild, roles)
{
    if (roles.length === 0) return;
    for (const role of roles)
    {
        if (guild.roles.cache.find(r => r.name === role))
            await guild.members.cache.get(user.id).roles.add(guild.roles.cache.find(r => r.name === role));
    }
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
            .then(console.log("> Role created"))
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