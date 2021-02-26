import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { app } from '../app';

describe("Users", ()=>{
    
    beforeAll(async() =>{
        const connection = await createConnection(); //realiza conexão
        await connection.runMigrations(); //executa migration
    });

    afterAll(async()=>{
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });
    
    it("Should be able to create a new user", async()=>{
        
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        });

        expect(response.status).toBe(201);
    });

    it("Should not be able to create a new user", async()=>{
        
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        });

        expect(response.status).toBe(400);
    });
});