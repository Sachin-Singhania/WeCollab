"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dashboard_1 = __importDefault(require("./Routes/dashboard"));
const video_1 = __importDefault(require("./Routes/video"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config({
    path: `./.env`
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
exports.prisma = new client_1.PrismaClient();
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use((0, cors_1.default)({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.get('/', (req, res) => {
    res.send("API Server is running");
});
app.use('/api/v1/dashboard', dashboard_1.default);
app.use('/api/v1/video', video_1.default);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
