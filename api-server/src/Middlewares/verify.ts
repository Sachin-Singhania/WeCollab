import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
//api server
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies.token);
    try {
        const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token ;
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            throw new Error('Invalid token');
        }
        req.user = decoded;
        console.log("I CAME HERE 1")
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token' });
    }
}