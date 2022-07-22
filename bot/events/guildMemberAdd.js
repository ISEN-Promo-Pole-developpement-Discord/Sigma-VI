const {logCreate} = require('../modtools/log/log-admin.js');
const {createChannel} = require('../utils/config-forms.js');
const { getSelectMenuFromJSON } = require('../forms/formManager.js');
const welcomeFormData = require('../forms/welcomeForm/welcomeForm.json');
module.exports = {
    name: "guildMemberAdd",
    once: false,
    execute(member) {
        /**
         * Emitted whenever a user joins a guild
         * @param {GuildMember} member The member that joined
         * @event guildMemberAdd
         * @returns {Promise<void>}
         */
         createChannel(member.guild,member);

         member.createDM().then(channel => {
            channel.send({components: getSelectMenuFromJSON(welcomeFormData, null)});
         });

            logCreate(
               member.guild,
               "GuildMember",
               null,
               member,
               "io"
               );
        }
}