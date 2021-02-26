//importação do express, do banco e das rotas
import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import "./database";
import {router} from "./routes";
import createConnection from './database';
import { AppError } from './errors/AppError';

createConnection();

//constante que faz a chamada ao express
const app = express();

app.use(express.json()); //habilita trabalhar com json dentro do express
app.use(router); //use nas rotas importadas

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError){
        return response.status(err.statusCode).json({
            message: err.message
        });
    }

    return response.status(500).json({
        status: "Error",
        message: 'Internal server error ${err.message}',
    });
});

export {app}