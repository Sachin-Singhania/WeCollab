"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_1 = require("../Controllers/dashboard");
const verify_1 = require("../Middlewares/verify");
const router = express_1.default.Router();
router.post('/new', dashboard_1.NewDashboard);
router.post('/join', verify_1.isAuthenticated, dashboard_1.JoinDashboard);
router.get('/get', verify_1.isAuthenticated, dashboard_1.GetDashboard);
router.get('/get-members', verify_1.isAuthenticated, dashboard_1.GetMembers);
router.post('/create-code', verify_1.isAuthenticated, dashboard_1.createCode);
router.get('/pending-request', verify_1.isAuthenticated, dashboard_1.GetRequest);
router.put('/accept-request', verify_1.isAuthenticated, dashboard_1.AcceptRequest);
router.put('/reject-request', verify_1.isAuthenticated, dashboard_1.RejectRequest);
exports.default = router;
