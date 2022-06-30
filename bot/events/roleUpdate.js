const {logAdminUpdate} = require('../modtools/log/log-admin.js');

module.exports = {
    name: "roleUpdate",
    once: false,
    execute(oldRole, newRole) {
        /**
         * Emitted when a role is updated.
         * @param {Role} oldRole The role before it was updated
         * @param {Role} newRole The role after it was updated
         * @event roleUpdate
         * @returns {Promise<void>}
        */
        
        let permissions = null;
        if (!oldRole.permissions.equals(newRole.permissions)) {
            permissions = new Array();
            const oldPerms = oldRole.permissions.toArray()
            const newPerms = newRole.permissions.toArray();
            for (let i=0; i<newPerms.length; i++) {
                if (!oldPerms.includes(newPerms[i])) {
                    permissions = permissions.concat({value: newPerms[i], added: true});
                }
            }

            for (let i=0; i<oldPerms.length; i++) {
                if (!newPerms.includes(oldPerms[i])) {
                    permissions = permissions.concat({value: oldPerms[i], added: false});
                }
            }
        }

        let data = new Array();

        if (oldRole.color !== newRole.color) data = data.concat([{name: "Color Changed", value: `${oldRole.hexColor} => ${newRole.hexColor}`}]);
        if (oldRole.hoist !== newRole.hoist) data = data.concat([{name: "Hoist Changed", value: `${oldRole.hoist} => ${newRole.hoist}`}]);
        if (oldRole.mentionable !== newRole.mentionable) data = data.concat([{name: "Mentionable changed", value: `${oldRole.mentionable} => ${newRole.mentionable}`}]);
        if (oldRole.position !== newRole.position) data = data.concat([{name: "Position Changed", value: `${oldRole.position} => ${newRole.position}`}]);
        if (permissions) {
            const permsText = permissions.map(x => {return x.added ? `+ ${x.value.replaceAll("_", " ")}` : `- ${x.value.replaceAll("_", " ")}`});
            data = data.concat([{name: "Permissions Changed", value: `\`\`\`md\n${permsText.join("\n")}\n\`\`\``, inline: false}]);
        }
        data = data.concat([
            {name:"ID", value:oldRole.id, inline:true},
            {name:"Creation", value:`<t:${Math.floor(newRole.createdTimestamp/1000)}:f>`, inline:true}
        ]);
        logAdminUpdate(
            oldRole.guild,
            `Role "${oldRole.name}" updated`,
            null,
            null,
            data,
            oldRole.name,
            newRole.name
        );
    }
}