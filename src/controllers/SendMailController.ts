import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import {resolve} from 'path';
import { AppError } from "../errors/AppError";

class SendMailController{
    async execute(request: Request, response: Response){
        const{email, survey_id} = request.body;

        //necessário para verificar se e-mail e pesquisa são válidos
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRepository.findOne({email});
        
        //caso não exista usuário
        if (!userAlreadyExists){
            throw new AppError("User does not exists!");
        }

        const survey = await surveysRepository.findOne({id:survey_id});

        //caso não exista a pesquisa
        if (!survey){
            throw new AppError ("Survey does not exists");
            
        }
        
        //arquivo handlebars
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");


        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where:{user_id: userAlreadyExists.id , value:null}, //condição AND
            relations: ["user", "survey"],
        });

        
        //variaveis do handlebars
        const variables = {
            name: userAlreadyExists.name,
            title: survey.title,
            description: survey.description,
            id : "",
            link: process.env.URL_MAIL,
        }

        if (surveyUserAlreadyExists){
            // caso exista pesquisa para usuário então usa-se o id da pesquisa existente
            variables.id = surveyUserAlreadyExists.id;
            
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        //1º => Salvar novas informações na table survey user
        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });
        await surveysUsersRepository.save(surveyUser);

        //caso não exista pesquisa para o usuário, então usa-se o id da psequisa criada logo acima
        variables.id = surveyUser.id;

        //2º => Enviar o e-mail para o usuário
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
        
    }
}

export {SendMailController}