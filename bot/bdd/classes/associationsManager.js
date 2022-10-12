const { Association } = require('./association.js');

/**
 * AssociationsManager class
 * @class
 * @classdesc Manage the associations
 * @alias AssociationsManager
 * @static
 */
class AssociationsManager
{
    /**
     * Get an association by its name
     * @param {string} name - The association's name (will be reconstructed by removing spaces and "ISEN" from the name) 
     * @returns {Promise<Association|null>} The association
     * @async
     */
    static async getAssociation(name)
    {
        if(typeof name !== "string")
            throw new Error("The name must be a string");
        name = name.toLowerCase();
        name = name.replace(/ISEN/g, "").replace(/ /g, "");
        const connection = global.sqlConnection;
        const query = "SELECT * FROM association WHERE name = ?";
        const data = await connection(query, name);
        if (data.length === 0) return null;
        else
            return new Association(data.asso_id);
    }

    /**
     * Get an association by its ID
     * @param {number|string} id - The association's ID
     * @returns {Promise<Association|null>} The association
     * @async
     */
    static async getAssociationByID(asso_id)
    {
        if(typeof asso_id !== "number" && typeof asso_id !== "string")
            throw new Error("The ID must be a number or a string");
        const connection = global.sqlConnection;
        const query = "SELECT * FROM association WHERE asso_id = ?";
        const data = await connection(query, [asso_id]);
        if (data.length === 0) return null;
        else
            return new Association(asso_id);
    }

    /**
     * Get all the associations
     * @returns {Promise<Array<Association>>} The associations
     * @async
     */
    static async getAssociations()
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM association";
        const data = await connection(query);
        if (data.length === 0) return [];
        else
        {
            let associations = [];
            for (let i = 0; i < data.length; i++)
                associations.push(await this.getAssociationByID(data[i].asso_id));
            return associations;
        }
    }

    /**
     * add an association
     * @param {object} association - The association's data
     * @param {string} association.name - The association's name
     * @param {string} association.description - The association's description
     * @param {string} association.icon - The association's icon
     * @returns {Promise<Association|null>} The association
     * @async
     */
    static async addAssociation(association)
    {
        if (typeof association !== "object")
            throw new Error("The association must be an object");
        if (typeof association.name !== "string")
            throw new Error("The association's name must be a string");
        if (await this.getAssociation(association.name) !== null) return null;
        const connection = global.sqlConnection;
        const query = "INSERT INTO association (name, description, icon) VALUES (?, ?, ?)";
        const values = [association.name, association.description, association.icon];
        await connection(query, values);
        return await this.getAssociation(association.name);
    }

    /**
     * Delete an association
     * @param {string|number} association - The association's Id!
     * @returns {Promise<void>}
     * @async
    */
    static async deleteAssociation(asso_id)
    {
        if (typeof asso_id !== "number" && typeof asso_id !== "string")
            throw new Error("The association's ID must be a number or a string");
        if (await this.getAssociationByID(asso_id) === null) return;
        const connection = global.sqlConnection;
        const query = "DELETE FROM association WHERE asso_id = ?";
        await connection(query, asso_id);
    }

}

module.exports = { AssociationsManager };