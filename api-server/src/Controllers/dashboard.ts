import { Request, Response } from "express";
import { Join, HttpStatusCode, Dashboard } from "../types/types";
import {  random6DigitCode } from "../utils/feature";
import { prisma } from "../index";
import { v4 as uuid } from 'uuid';
import { Role } from "@prisma/client";
export const JoinDashboard = async (req: Request<{}, {}, Join>, res: Response) => {
    try {
        const { code } = req.body;
        if(!code) return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Code is required" });
        const {_id}= req.user;
        console.log(_id);
        const codeCheck = await prisma.code.findFirst({
            where: {
                code: code,
            }
        });
        if (!codeCheck) return res.status(HttpStatusCode.NOT_FOUND).json({ message: "Invalid code" });
        if (codeCheck?.expiresAt < new Date()) {
            return res.status(HttpStatusCode.BAD_GATEWAY).json({ message: "Code has expired" })
        }
        const dashboard = await prisma.dashboardUser.findFirst({
            where: {
                        userId: _id
            }
        });
        console.log(dashboard);
        if (dashboard) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'User already has a dashboard' });
        }
        const search = await prisma.dashboardUser.findFirst({
            where: {
                dashboardId: codeCheck.dashboardId,
                role: Role.OWNER,
            },
            select: {
                userId: true,
            },
        });

        if (!search) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard is not found' });
        }
        const existingRequest = await prisma.request.findFirst({
            where: {
                userId: _id,
                status : 'PENDING',
                dashboardId: codeCheck.dashboardId,
            },
        });
        if (existingRequest) {
            return res.status(HttpStatusCode.NO_CONTENT).json({ message: 'Join request already sent' });
        }
        const pendingRequestsCount = await prisma.request.count({
            where: {
                status: 'PENDING',
                dashboardId: codeCheck.dashboardId,
            },
        });
        
        if (pendingRequestsCount > 0) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'A pending request already exists for this dashboard' });
        }
        await prisma.request.create({
            data: {
                id: uuid(),
                userId: _id,
                dashboardId: codeCheck.dashboardId,
            },
        });
        // const sendReqest= await prisma.request.upsert({
        //     where:{
        //          userId_dashboardId: {
        //              userId: _id,
        //              dashboardId: codeCheck.dashboardId
        //          }
        //     },
        //     update:{},
        //     create: {
        //         userId: _id,
        //         id : uuid(),
        //         dashboardId : codeCheck.dashboardId
        //     }
        // });
        return res.status(HttpStatusCode.OK).json({ message: 'Request Sent to the admin',}); 
    } catch (error) {
        console.log(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}
export const NewDashboard = async (req: Request<{}, {}, Dashboard>, res: Response) => {
    try {
        const { name, ownerId } = req.body;
        if (!name || !ownerId) { 
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Name and owner id are required'});
        }
        const dashboard = await prisma.dashboard.findFirst({
            where: {
                users: {
                    some: {
                        userId: ownerId
                    }
                }
            }
        });
        if (dashboard) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'User already has a dashboard' });
        }
        const newDashboard = await prisma.dashboard.create({
            data: {
                name,
                id: uuid(),
                users: {
                    create: {
                        id: uuid(),
                        userId: ownerId,
                        role: 'OWNER'
                    }
                }
            },select :{
                id:true,
                name:true,
                Video:{
                    select: {
                        id: true,
                        name: true,
                        uploadedBy: true,
                      }
                },
                YoutubeUpload:{
                    select: { id: true, title: true }
                },
                Request:{
                    select:{
                        userId :true,
                        id :true,
                    }
                }
            }
        });
        return res.status(HttpStatusCode.CREATED).json({ message: 'Dashboard created', dashboardId: newDashboard });
    } catch (error) {
        console.log(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}
export const createCode = async (req: Request, res: Response) => {
    try {
        const { dashboardId } = req.body;
        console.log(req.body);
        if (!dashboardId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Dashboard id is required' });
            }
        const dashboard = await prisma.dashboard.findFirst({
            where: {
                id: dashboardId
            }
        })
        if (!dashboard) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard not found' });
        }
        const existingCode = await prisma.code.findUnique({
            where: { dashboardId },
        });
        
        const code = random6DigitCode();
        if (existingCode) {
            const isExpired = new Date(existingCode.expiresAt) < new Date();
            if (!isExpired) {
                return res.status(HttpStatusCode.OK).json({ message: 'Code updated', code: existingCode.code });
            }
            else {
                const updatedCode = await prisma.code.update({
                    where: { dashboardId },
                    data: {
                        code: code.toString(),
                        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    },
                    select: { code: true }
                });
                return res.status(HttpStatusCode.OK).json({ message: 'Code updated', code: updatedCode.code });
            }
        }
        const newCode = await prisma.code.create({
            data: {
                code: code.toString(),
                dashboardId,
                id: uuid(),
                expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            },
            select: {
                code: true
            }
        });
        return res.status(HttpStatusCode.CREATED).json({ message: 'Code created', code: newCode.code });
    } catch (error) {
        console.log(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}
export const AcceptRequest = async (req: Request, res: Response) => {
    try {
        const {requestId,userId,dashboardId } = req.body;
         if (!requestId || !userId || !dashboardId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Request id, user id and dashboard id are required' });
         }
        
        const userCount = await prisma.dashboardUser.count({
            where: {
                dashboardId,
            },
        });
        if (!userCount){
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard not found' });
        }
        if (userCount >= 2) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Dashboard is full' });
        }
        const [editor, update] = await prisma.$transaction([
            prisma.dashboardUser.create({
                data: {
                    dashboardId,
                    id: uuid(),
                    userId,
                    role: 'EDITOR'
                }
            }),
            prisma.request.update({
                where: {
                    id :requestId
                },
                data: {
                    status: 'ACCEPTED',
                }
            })
        ]);
        if (!update) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
        if (!editor) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to add user' });
        }
        return res.status(HttpStatusCode.OK).json({ message: 'Request accepted' });
    } catch (error) {
        console.log(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}
 export const RejectRequest = async (req: Request, res: Response) => {
    try {
        const {requestId,dashboardId} = req.body;
        if (!requestId || !dashboardId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Request id and dashboard id are required' });
        }
        const reject = await prisma.request.update({
            where:{
                id: requestId,
                status :"PENDING",
                dashboardId
            },
            data:{
                status :"REJECTED"
            }
        });
        if (!reject) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
        return res.status(HttpStatusCode.OK).json({ message: 'Request rejected' });
    } catch (error) {
        console.log(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        
    }
 }
export const GetRequest = async (req: Request, res: Response) => {
    try {
         const {dashboardId} = req.body;
         if (!dashboardId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Dashboard id is required' });
         }
         const dashboard = await prisma.dashboard.findUnique({
            where: {
                id: dashboardId
            },select:{
                Request :{
                    where:{
                        status :'PENDING',
                    },
                    select:{
                        userId:true,
                        id :true
                    }
                }
            }
         });
         if (!dashboard) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard not found' });
         }
         return res.status(HttpStatusCode.OK).json({ message: 'Request found', data: dashboard.Request });
           
    } catch (error) {
        console.log(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}
export const GetMembers = async (req: Request, res: Response) => {
    try {
         const {dashboardId} = req.body;
         if (!dashboardId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Dashboard id is required' });
         }
        const {_id} = req.user;
         const dashboard = await prisma.dashboardUser.findMany({
            where :{
                id :dashboardId,
                userId:{
                    not : _id
                }
            },
            select:{
                userId :true,
            }
         })
         if (!dashboard) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard not found' });
         }
         return res.status(HttpStatusCode.OK).json({ message: 'Members found', data: dashboard });
    } catch (error) {
         return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}
export const GetDashboard = async (req: Request, res: Response) => {
    try {
        const {_id} = req.user;
        const mergedData = await prisma.$transaction(async (prisma) => {
            const dashboards = await prisma.dashboardUser.findMany({
              where: { userId: _id },
              select: {
                role: true,
                dashboard: {
                  select: {
                    id: true,
                    name: true,
                    Video: {
                      select: {
                        id: true,
                        name: true,
                        uploadedBy: true,
                      },
                    },
                  },
                },
              },
            });
            
            if (!dashboards || dashboards.length === 0) return null;
            const dashboardData = dashboards[0].dashboard;
            if(dashboards[0].role==="EDITOR") return {
                id: dashboardData.id,
                name: dashboardData.name,
                role: dashboards[0].role,
                Video: dashboardData.Video,
            }
            const YoutubeUploads = await prisma.youtubeUpload.findMany({
              where: { dashboardId: dashboardData.id },
              select: { id: true, title: true },
            });
            const Request= await prisma.request.findMany({
                where : {dashboardId:dashboardData.id,
                    status: 'PENDING',
                },
                select: {
                    id: true,
                    userId : true,
                }
            })
            return {
              id: dashboardData.id,
              name: dashboardData.name,
              role: dashboards[0].role,
              Video: dashboardData.Video,
              YoutubeUploads,
              Request
            };
          });
      
          if (!mergedData) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: "Dashboard not found" });
          }
      
          return res.status(HttpStatusCode.OK).json(mergedData);
    } catch (error) {
        return;
    }
}