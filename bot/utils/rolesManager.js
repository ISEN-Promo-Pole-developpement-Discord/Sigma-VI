
async function assignRoles(user, guild, roles)
{
    if (roles.length === 0) return;
    for (const role of roles)
    {
        if (guild.roles.cache.find(r => r.name === role))
            await guild.members.cache.get(user.id).roles.add(guild.roles.cache.find(r => r.name === role));
    }
}

async function assignValidationRole(user, guild, roleName)
{
    if (guild.roles.cache.find(r => r.name === roleName))
    {
        if (global.debug) console.log("> Role found");
        await guild.members.cache.get(user.id).roles.add(guild.roles.cache.find(r => r.name === roleName))
    }
    else
    {
        if (global.debug) console.log("> Role not found");
        let testRole = await guild.roles.create()
            .then(console.log("> Role created"))
            .catch(console.error);
        await testRole.edit(
            {
                name: roleName,
                color: "#ffffff",
            });

        await guild.members.cache.get(user.id).roles.add(guild.roles.cache.find(r => r.name === roleName));
    }
}

module.exports = {
    assignRoles,
    assignValidatedRole,
}