const { Association } = require('./association.js');

class AssociationsManager
{
    static async getAssociation(name)
    {
        name = name.toLowerCase();
        name = name.replace(/ISEN/g, "").replace(/ /g, "");
        const connection = global.sqlConnection;
        const query = "SELECT * FROM association WHERE name = ?";
        const data = await connection(query, name);
        if (data.length === 0) return null;
        else
            return new Association(data.asso_id);
    }

    static async getAssociationByID(asso_id)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM association WHERE asso_id = ?";
        const data = await connection(query, [asso_id]);
        if (data.length === 0) return null;
        else
            return new Association(asso_id);
    }

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

    static async addAssociation(association)
    {
        if (await this.getAssociation(association.name) !== null) return;
        const connection = global.sqlConnection;
        const query = "INSERT INTO association (name, description, icon) VALUES (?, ?, ?)";
        const values = [association.name, association.description, association.icon];
        await connection(query, values);
        return await this.getAssociation(association.name);
    }

    static async deleteAssociation(asso_id)
    {
        if (await this.getAssociationByID(asso_id) === null) return;
        const connection = global.sqlConnection;
        const query = "DELETE FROM association WHERE asso_id = ?";
        await connection(query, asso_id);
    }

}

module.exports = { AssociationsManager };