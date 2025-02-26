import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import dashboard from './Routes/dashboard';
import video from './Routes/video';
 import path from 'path';
import { PrismaClient } from "@prisma/client";
import cookieParser from 'cookie-parser';
dotenv.config({
    path: `./.env`
});

const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();
app.use(cookieParser());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    next();
})
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(cors( 
    {
        credentials : true,
        origin: 'http://localhost:3000'
    }
))

app.get('/',(req,res)=>{
    res.send("API Server is running")
})
app.use('/api/v1/dashboard',dashboard);
app.use('/api/v1/video',video);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))