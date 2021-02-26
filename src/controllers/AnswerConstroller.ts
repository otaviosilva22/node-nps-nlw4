import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController{


    // Extrutura do link:
    // http://localhost:3333/answers/10?u=6a48822d-c014-4e0c-8d9c-ded27b518dfe
    
    // Parametros de uma requisição
    /**
     * Route params => Parametros que compõe a rota /
     * routes.get(/answers/:value); => identifica parametros routes
     * 
     * Query params => Parametros utilizados para busca e paginação
     * chave=valor => Composição do query params
     */
    async execute(request: Request, response: Response){
        const {value} = request.params; //route params
        const {u} = request.query; //query params

        //repositorio que extende de SurveyUser
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        //seleect na entidade surveyUser com where no query params
        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        //caso não exista pesquisa direcionada para um usuário
        if (!surveyUser){
            throw new AppError("Survey User does not exists");

        }

        //parse para receber o answer como do tipo number
        surveyUser.value = Number(value);

        //atualiza resposta que antes era null na entidade SurveyUser
        await surveysUsersRepository.save(surveyUser); 

        return response.json(surveyUser);

    }

}   

export {AnswerController}