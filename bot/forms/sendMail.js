const nodemailer = require("nodemailer");
const config = require("../config.json");
const fs = require("fs");
const htmlContent = fs.readFileSync('./forms/templateMailCode.html', 'utf8');


let transporter = nodemailer.createTransport(config.mail,{
    from: 'SIGMA <no-reply@sigma-bot.fr>',
});

module.exports = {
    sendCodeMail(user, code) {
        let message = {
            //to: `${user.name, user.surname} <${user.mail}>`,
            to: "Thomas SEIGNOUR <$thomas.seignour@isen.yncrea.fr>",
            subject: "SIGMA | Code d'authentification",
            text: `[CODE D'AUTHENTIFICATION]\n${code}\nPour lier votre compte discord (${user.tag}) à votre identité, un code de vérification est demandé.`,
            // HTML body
            html: htmlContent.replace('TAG_PLACEHOLDER', user.tag).replace('CODE_PLACEHOLDER', code),
        };
        return new Promise(function (res, rej) {
            transporter.sendMail(message, function cb(err, data) {
                if(err) rej(err);
                else res(data);
            });
        });
    }
}