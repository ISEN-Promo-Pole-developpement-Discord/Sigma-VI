const {includedSimilarity} = require("../../processors/stringIncludeSimilarity");
const getFloor3DLink = require("../../processors/getFloor3DLink");

/**
 * Class representing a contact.
 * @param {string} id The contact's id (name.surname)
 * @param {object} contact The contact's data
 * @param {string} contact.name The contact's name
 * @param {string} contact.surname The contact's surname
 * @param {string} contact.email The contact's email
 * @param {string} contact.desk The contact's desk
 * @param {Array<string>} contact.functions The contact's functions
 * @param {Array<string>} contact.phones The contact's phones
 */
class Contact{
    constructor(id, contact){
        this.id = id;
        this.contact = contact;
    }

    /**
     * get the contact's full name (name + surname)
     * @returns {string} The contact's full name
     */
    getFullName(){
        return this.contact.name + " " + this.contact.surname;
    }

    /**
     * get the contact's email
     * @returns {string} The contact's email
     */
    getMail(){
        return this.contact.mail;
    }

    /**
     * get the contact's Phones
     * @returns {Array<string>} The contact's phones
     */
    getPhones(){
        return this.contact.phones;
    }

    /**
     * get the contact's desk
     * @returns {string} The contact's desk
     */
    getDesk(){
        return this.contact.desk;
    }

    /**
     * get the contact's functions
     * @returns {Array<string>} The contact's functions
     */
    getFunctions(){
        return this.contact.functions;
    }

    /**
     * get the contact's discord id
     * @returns {string|null} The contact's discord id
     * @async
     */
    async getDiscordId(){
        var results = await global.usersManager.searchUsers({email:this.getMail()});
        if(results.length === 0) return null;
        return results[0].id;
    }

    /**
     * get the contact's fields for the contact card
     * @returns {Array<object>} The contact's fields
     * @async
     */
    async getFields(){
        let fields = [
            {
                name: "Mail",
                value: `[${this.contact.mail}](https://sigma-bot.fr/mail?m=${this.contact.mail})`,
                inline: true
            }
        ];
        if(this.contact.desk !== null && this.contact.desk !== ""){
            let floor3DLink = getFloor3DLink(this.contact.desk);
            fields.push({
                name: "Bureau",
                value: `[${this.contact.desk}](${floor3DLink})`,
                inline: true
            });
        }
        if(this.contact.phones.length > 0){
            let formatedNumbers = this.contact.phones.map(number => {
                return `[+33 ${number.slice(0,2)} ${number.slice(2,4)} ${number.slice(4,6)} ${number.slice(6,8)} ${number.slice(8,10)}](https://sigma-bot.fr/call?n=${number})`;
            });
            fields.push({
                name: "Tél",
                value: formatedNumbers.join("\n"),
                inline: true
            });
        }
        if(await this.getDiscordId() != null){
            fields.push({
                name: "Discord",
                value: "<@" + await this.getDiscordId() + ">",
                inline: true
            });
        }
        return fields;
    }
}

/**
 * contactManager class, used to manage contacts
 * @class
 */
class Contacts{
    constructor(){
        var path = require("path");
        var data = require("fs").readFileSync(path.join(__dirname, "./contacts.csv"), "utf8").replace(/"/g, "");
        this.contacts = {}; 

        for(var line of data.split("\n")){
            var [title, mail, phone, name, surname, desk, function1, function2, function3, function4] = line.split(",");
            if(title == "Title") continue;
            var functions = [function1, function2, function3, function4];
            functions = functions.map(function(f){ return f.trim(); });
            functions = functions.filter(function(f){return f !== "" && f});

            var phones = phone.replace(/ /gm, "").trim().split("-");
            phones = phones.filter(function(p){return p !== "NC" && p});

            var contact = {
                title: title.trim(),
                mail: mail.trim(),
                phones: phones,
                name: name.trim(),
                surname: surname.trim(),
                desk: desk.trim(),
                functions: functions
            };

            const formatedName = contact.name.toLowerCase().normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").replaceAll(" ","-");
            const formatedSurname = contact.surname.toLowerCase().normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").replaceAll(" ","-");
            var id = formatedName + "." + formatedSurname;
            this.contacts[id] = contact;
        }
    }

    /**
     * Get a contact by his id
     * @param {string} id The contact's id
     * @returns {Contact|null} The contact
     */
    getContact(id){
        if(typeof id !== "string")
            throw new Error("id must be a string");
        if(this.contacts[id] == null) return null;
        return new Contact(id, this.contacts[id]);
    }

    /**
     * Search for contacts by a string
     * @param {string} string The string to search
     * @returns {Array<Contact>} The contacts found
     */
    searchContacts(string){
        var results = [];
        for(const [id, contact] of Object.entries(this.contacts)){
            var datas = [contact.name, contact.surname, contact.mail, contact.desk, ...contact.functions, ...contact.phones];
            var similarity = includedSimilarity(datas.join(" "), string);
            if(similarity > 0.5) results.push(new Contact(id, contact));
        }
        return results;
    }

    /**
     * Search for contacts by a string and return the best result
     * @param {string} string The string to search
     * @returns {Contact|null} The best contact found
     */
    searchContact(string){
        var results = this.searchContacts(string);
        if(results.length === 0) return null;
        if(results.length === 1) return results[0];
        var maxScore = 0;
        var maxScoreContact = 0;
        for(var contact of results){
            var datas = [contact.getFullName(), contact.getMail(), contact.getDesk(), ...contact.getFunctions(), ...contact.getPhones()];
            var similarity = includedSimilarity(datas.join(" "), string);
            if(similarity > maxScore){
                maxScore = similarity;
                maxScoreContact = contact;
            }
        }
        if(maxScore > 0.5) return maxScoreContact;
        else return null;
    }

    /**
     * Get a list of all contacts names
     * @returns {Array<string>} The contacts names
     */
    getContactsList(){
        var list = [];
        for(const [id, contact] of Object.entries(this.contacts)){
            list.push([contact.name, contact.surname]);
        }
        list = list.sort((a, b) => a[1].localeCompare(b[1]));
        return list;
    }
}

module.exports = new Contacts();