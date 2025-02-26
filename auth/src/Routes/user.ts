import express, { RequestHandler } from "express";
import { checkAndRefreshToken, getUser, Update, Signin, Signup ,  } from '../Controllers/auth'
import { isAuthenticated } from "../Middlewares/auth";

class User{
    app: express.Router;
    public static instance: User;
    private constructor(){
        this.app=express.Router();
        this.routes();
    }
    public static getInstance(){
       if(!this.instance)
        this.instance=new User();
    return this.instance;
    }
    routes(){
        this.app.post('/signup',Signup  as unknown as RequestHandler);
        this.app.post('/signin',Signin as unknown as RequestHandler);
        this.app.get('/get',isAuthenticated as unknown as RequestHandler,getUser as unknown as RequestHandler);
        this.app.post('/storeTokens',isAuthenticated as unknown as RequestHandler, Update as unknown as RequestHandler);
        this.app.get('/refresh-token/:userId',checkAndRefreshToken as unknown as RequestHandler);
    }
}
export default User.getInstance().app;