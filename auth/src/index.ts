import express, { Request, Response } from 'express';
import cors from 'cors'
import { config } from 'dotenv';
import morgan from "morgan"
import UserRoute from './Routes/user.js';
import cookieParser from 'cookie-parser';

import { PrismaClient } from '@prisma/client';
config({
    path: `./.env`
});

class Server{
    port = process.env.PORT || 3000;
    app: express.Application;
    private static instance: Server;
    prisma : PrismaClient;
    private whitelist = ['http://localhost:3000', 'https://dms-organize.vercel.app']
    private constructor(){
        this.app = express()
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();
        this.prisma = new PrismaClient();
    }
    public static getInstance(){
        if(!this.instance)
         this.instance=new Server();
     return this.instance;
     }
    routes(){
        this.app.get('/',function(req: Request, res: Response){
            return res.send('Hello World');
        } as unknown as express.RequestHandler);
        this.app.use('/api/v1/user',UserRoute);
    }
    middlewares(){
        this.app.use(cors({
              credentials: true,
              origin: ['http://localhost:3000','http://localhost:8080']
            }))
        this.app.use(express.json());
        this.app.use(morgan('dev'))
        this.app.use(cookieParser())
        
    }
    getPrisma(){
        return this.prisma;
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log(`The server is running on port ${this.port}`);
        })
    }
}
export const prisma = Server.getInstance().getPrisma();
Server.getInstance().listen();