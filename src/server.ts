/** Tópicos abordados no evendo
 * Node => Permite o uso de JavaScript no backend
 * Yarn => gerenciador de pacotes;
 * Express => framework node.js para criação de servidor, rotas etc;
 * @ types/express -D (desenvolvimento) => biblioteca para manipulação do express
 * TypeScript => melhora comunicação com parâmetros de funções;
 * ts-node-dev => converte TypeScript para JavaScript;
 * Insomnia => ferramenta para testes de API, já que Chrome só atende rota GET;
 * TypeORM => ORM que facilita comunicação com diferentes bancos;
 * SQLite => Banco em memória para aplicações pequenos;
 * Migration => Comandos de criação relacionado ao banco de dados -> yarn typeorm migration:run (executa migrations)
 * Beekeaper => Ferramenta para manipulação de db;
 * UUID => Tipagem para chave primária;
 * Testes Automatizados => Diferentes tipos de testes;
 * Jest => Dependência para de testes;
 * SuperTest=> Ferramenta para testes que simula servidor;
 * NodeMailer => Biblioteca para envio de e-mails;
 * Handlebars => Permite a comunicação de back com front
 * Yup => Biblioteca de validação
 * Middleware => Tudo aquilo que está no caminho entre requisição e resposta;
 * Express-async-errors => Biblioteca do express para tratamento de erros
*/


import {app} from "./app";

//cria servidor
app.listen(3333, () => console.log("Server is runing!"));