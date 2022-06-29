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
    }
}