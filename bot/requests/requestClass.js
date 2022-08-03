class Request {
    constructor(message, string){
        this.content = string;
        this.message = message;
    }

    getMessage(){
        return this.message;
    }

    getContent(){
        return this.content;
    }

    getAuthor(){
        return this.message.author;
    }

    getChannel(){
        return this.message.channel;
    }

    words(){
        return this.content.split(" ");
    }

    //Standardized Request Wording Format
    SRWF(){
        return this.content.toLowerCase().trim().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    }
    
    SRWFwords(){
        return this.SRWF().split(" ");
    }

    async notifyStart(){
        this.notifyMesssage = await this.getMessage().reply({content: 'Un instant...', ephemeral: true});
        this.getChannel().sendTyping();
    }

    notifyError(){
        this.notifyMesssage.edit({content: 'Une erreur est survenue.', ephemeral: true});
    }

    notifyEnd(content){
        this.getMessage().reply({content: content});
        // this.notifyMesssage.delete();
    }
}

module.exports = {Request};