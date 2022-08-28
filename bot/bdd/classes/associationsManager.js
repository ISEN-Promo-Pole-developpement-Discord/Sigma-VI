const Association = require('./association');

class AssociationsManager
{
    static async getAssociations(name)
    {
        const connection = global.sqlConnection;
        const query = "SELECT * FROM association WHERE name = ?";
        const data = await connection(query, name);
        if (data.length === 0) return null;
        else
            return new Association(data[0].asso_id);
    }

    static async addAssociation(association)
    {
        const connection = global.sqlConnection;
        const query = "INSERT INTO association (name, description, icon) VALUES (?, ?, ?)";
        const values = [association.name, association.description, association.icon];
        await connection(query, values);
        return await this.getAssociations(association.name);
    }
}

module.exports = {AssociationsManager};