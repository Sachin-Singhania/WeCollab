import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { prisma } from '..';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token ;
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        if (!process.env.JWT_SECRET) {
            return res.json({message:'JWT_SECRET is not defined'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.json({message:'Invalid token'});
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token' });
    }
}