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
        var content = this.content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        return content.toLowerCase().trim().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    }
    
    SRWFwords(){
        return this.SRWF().split(" ");
    }

    async notifyStart(){
        await this.getChannel().sendTyping();
    }

    notifyError(){
        this.getMessage().reply({content: "Une erreur est survenue lors de la traitement de votre requête."});
    }

    notifyEnd(content){
        this.getMessage().reply(content);
        // this.notifyMesssage.delete();
    }

    createdAt(){
        return this.message.createdAt;
    }
}

module.exports = {Request};