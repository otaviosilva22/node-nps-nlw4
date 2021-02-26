
import {Request, Response} from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';


// => Cálculo do NPS
class NpsController{
    
    /**
     * 
     * 1 2 3 4 5 6 7 8 9 10
     * Detratores => 0 - 6
     * Passivos => 7 - 8
     * Promotores => 9 - 10
     * 
     * (numero de promotres - numero de detratores) / (numero de respondentes) * 100 
     */
    
    
    
    async execute(request: Request, response: Response){

        //parametro de rota
        const {survey_id} = request.params;

        //repositório de extensão de surveys users
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        //select na entidade surveysUser com where no parametro de rota survey_id
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()), //todos que nao sao como nulos
        });

        //faz uma varredura um a um para encontrar detratores
        const detractor = surveysUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        //promoters
        const promoters = surveysUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        //passivos
        const passive = surveysUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        //total de respostas
        const totalAnswers = surveysUsers.length;

        //cálculo de nps
        const calculate = Number(
            (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
        );

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps: calculate
        })
    }
}

export {NpsController}