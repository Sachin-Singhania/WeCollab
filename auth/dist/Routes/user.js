"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../Controllers/auth");
const auth_2 = require("../Middlewares/auth");
class User {
    constructor() {
        this.app = express_1.default.Router();
        this.routes();
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new User();
        return this.instance;
    }
    routes() {
        this.app.post('/signup', auth_1.Signup);
        this.app.post('/signin', auth_1.Signin);
        this.app.get('/get', auth_2.isAuthenticated, auth_1.getUser);
        this.app.post('/storeTokens', auth_2.isAuthenticated, auth_1.Update);
        this.app.get('/refresh-token/:userId', auth_1.checkAndRefreshToken);
    }
}
exports.default = User.getInstance().app;
