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
        this.getChannel().sendTyping();
    }

    notifyError(){
        this.getMessage().reply({content: "Une erreur est survenue lors de la traitement de votre requête."});
    }

    notifyEnd(content){
        this.getMessage().reply({content: content});
        // this.notifyMesssage.delete();
    }
}

module.exports = {Request};