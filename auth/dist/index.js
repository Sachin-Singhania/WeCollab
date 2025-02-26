"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const user_js_1 = __importDefault(require("./Routes/user.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
(0, dotenv_1.config)({
    path: `./.env`
});
class Server {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.whitelist = ['http://localhost:3000', 'https://dms-organize.vercel.app'];
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new Server();
        return this.instance;
    }
    routes() {
        this.app.get('/', function (req, res) {
            return res.send('Hello World');
        });
        this.app.use('/api/v1/user', user_js_1.default);
    }
    middlewares() {
        this.app.use((0, cors_1.default)({
            credentials: true,
            origin: ['http://localhost:3000', 'http://localhost:8080']
        }));
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cookie_parser_1.default)());
    }
    getPrisma() {
        return this.prisma;
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`The server is running on port ${this.port}`);
        });
    }
}
exports.prisma = Server.getInstance().getPrisma();
Server.getInstance().listen();
