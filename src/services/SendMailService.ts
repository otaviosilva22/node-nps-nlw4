import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Table } from 'typeorm';
import {resolve} from 'path';
import handlebars, { template } from 'handlebars';
import fs from 'fs';

class SendMailService {


    private client: Transporter;
    constructor(){
        nodemailer.createTestAccount().then((account)=>{
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                }
            });

            this.client = transporter;
        })
    }

    async execute(to: string, subject: string, variables: object, path:string){
        
        
        //leitura do arquivo
        const templateFileContent = fs.readFileSync(path).toString("utf-8"); 
        
        //compila o arquivo handlebars
        const mailTemplateParse = handlebars.compile(templateFileContent);

        //recebe o arquivo handlebars com as variáveis
        const html = mailTemplateParse(variables);

        //envia o email
        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@nps.com.br>",
        });

        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));    
        
    }

}

export default new SendMailService();

