const config = require("../config-core.json");

  async function manageRoles(member, roles, typeOfAction = false)
{
    let guild = member.guild;
    await guild.roles.fetch();
    var rolesPending = [];

    for (let role of roles)
    {
        if (typeof role === "string") {
            var targetRoleString = role.toLowerCase().replace(/ /g, "");
            var roleFound = false;
            for(let guildRole of guild.roles.cache.values())
            {
                var guildRoleString = guildRole.name.toLowerCase().replace(/ /g, "");
                if (guildRoleString === targetRoleString)
                {
                    // typeOfAction === 0 => add role
                    if (!typeOfAction)
                    {
                        if (!(member.roles.cache.some(r => r.name === guildRole.name))) {
                            rolesPending.push(member.roles.add(guildRole));
                        }
                    }
                    // typeOfAction === 1 => remove role
                    else
                    {
                        if (member.roles.cache.some(r => r.name === guildRole.name)) {
                            rolesPending.push(member.roles.remove(guildRole));
                        }
                    }
                    roleFound = true;
                }
            }
        }
    }
    return Promise.all(rolesPending);
}

async function assignVerifiedRole(user, guild)
{
    let roleName = config.verifiedRoleName;
    if (guild.roles.cache.find(r => r.name === roleName))
    {
        await guild.members.cache.get(user.id).roles.add(guild.roles.cache.find(r => r.name === roleName))
    }
    else
    {
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
    manageRoles,
    assignVerifiedRole,
}