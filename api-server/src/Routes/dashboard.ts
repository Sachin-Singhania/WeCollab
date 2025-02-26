import express from "express"
import {AcceptRequest, createCode, GetDashboard, GetMembers, GetRequest, JoinDashboard, NewDashboard, RejectRequest} from "../Controllers/dashboard";
import { isAuthenticated } from "../Middlewares/verify";
const router = express.Router();
router.post('/new',NewDashboard as unknown as express.RequestHandler );
router.post('/join',isAuthenticated as unknown as express.RequestHandler,JoinDashboard as unknown as express.RequestHandler );
router.get('/get',isAuthenticated as unknown as express.RequestHandler,GetDashboard as unknown as express.RequestHandler );
router.get('/get-members' ,isAuthenticated as unknown as express.RequestHandler,GetMembers as unknown as express.RequestHandler );
router.post('/create-code',isAuthenticated as unknown  as express.RequestHandler,createCode as unknown as express.RequestHandler );
router.get('/pending-request',isAuthenticated as unknown  as express.RequestHandler,GetRequest as unknown as express.RequestHandler );
router.put ('/accept-request' ,isAuthenticated as unknown  as express.RequestHandler,AcceptRequest as unknown as express.RequestHandler );
router.put('/reject-request' ,isAuthenticated as unknown  as express.RequestHandler,RejectRequest as unknown as express.RequestHandler );
export default router;