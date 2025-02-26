"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboard = exports.GetMembers = exports.GetRequest = exports.RejectRequest = exports.AcceptRequest = exports.createCode = exports.NewDashboard = exports.JoinDashboard = void 0;
const types_1 = require("../types/types");
const feature_1 = require("../utils/feature");
const index_1 = require("../index");
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const JoinDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        const { _id } = req.user;
        console.log(_id);
        const codeCheck = yield index_1.prisma.code.findFirst({
            where: {
                code: code,
            }
        });
        if (!codeCheck)
            return res.status(types_1.HttpStatusCode.NOT_FOUND).json({ message: "Invalid code" });
        if ((codeCheck === null || codeCheck === void 0 ? void 0 : codeCheck.expiresAt) < new Date()) {
            return res.status(types_1.HttpStatusCode.BAD_GATEWAY).json({ message: "Code has expired" });
        }
        const dashboard = yield index_1.prisma.dashboardUser.findFirst({
            where: {
                userId: _id
            }
        });
        console.log(dashboard);
        if (dashboard) {
            return res.status(types_1.HttpStatusCode.BAD_REQUEST).json({ message: 'User already has a dashboard' });
        }
        const search = yield index_1.prisma.dashboardUser.findFirst({
            where: {
                dashboardId: codeCheck.dashboardId,
                role: client_1.Role.OWNER,
            },
            select: {
                userId: true,
            },
        });
        if (!search) {
            return res.status(types_1.HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard is not found' });
        }
        const existingRequest = yield index_1.prisma.request.findFirst({
            where: {
                userId: _id,
                status: 'PENDING',
                dashboardId: codeCheck.dashboardId,
            },
        });
        if (existingRequest) {
            return res.status(types_1.HttpStatusCode.NO_CONTENT).json({ message: 'Join request already sent' });
        }
        const pendingRequestsCount = yield index_1.prisma.request.count({
            where: {
                status: 'PENDING',
                dashboardId: codeCheck.dashboardId,
            },
        });
        if (pendingRequestsCount > 0) {
            return res.status(types_1.HttpStatusCode.BAD_REQUEST).json({ message: 'A pending request already exists for this dashboard' });
        }
        yield index_1.prisma.request.create({
            data: {
                id: (0, uuid_1.v4)(),
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
        return res.status(types_1.HttpStatusCode.OK).json({ message: 'Request Sent to the admin', });
    }
    catch (error) {
        console.log(error);
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.JoinDashboard = JoinDashboard;
const NewDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, ownerId } = req.body;
        const dashboard = yield index_1.prisma.dashboard.findFirst({
            where: {
                users: {
                    some: {
                        userId: ownerId
                    }
                }
            }
        });
        if (dashboard) {
            return res.status(types_1.HttpStatusCode.BAD_REQUEST).json({ message: 'User already has a dashboard' });
        }
        const newDashboard = yield index_1.prisma.dashboard.create({
            data: {
                name,
                id: (0, uuid_1.v4)(),
                users: {
                    create: {
                        id: (0, uuid_1.v4)(),
                        userId: ownerId,
                        role: 'OWNER'
                    }
                }
            },
        });
        return res.status(types_1.HttpStatusCode.CREATED).json({ message: 'Dashboard created', dashboardId: newDashboard.id });
    }
    catch (error) {
        console.log(error);
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.NewDashboard = NewDashboard;
const createCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dashboardId, userId } = req.body;
        const dashboard = yield index_1.prisma.dashboard.findFirst({
            where: {
                id: dashboardId
            }
        });
        if (!dashboard) {
            return res.status(types_1.HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard not found' });
        }
        const code = (0, feature_1.random6DigitCode)();
        const newCode = yield index_1.prisma.code.create({
            data: {
                code: code.toString(),
                dashboardId,
                id: (0, uuid_1.v4)(),
                expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            },
            select: {
                code: true
            }
        });
        return res.status(types_1.HttpStatusCode.CREATED).json({ message: 'Code created', code: newCode.code });
    }
    catch (error) {
        console.log(error);
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.createCode = createCode;
const AcceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId, userId, dashboardId } = req.body;
        const userCount = yield index_1.prisma.dashboardUser.count({
            where: {
                dashboardId,
            },
        });
        console.log(userCount);
        if (!userCount) {
            return res.status(types_1.HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard not found' });
        }
        if (userCount >= 2) {
            return res.status(types_1.HttpStatusCode.BAD_REQUEST).json({ message: 'Dashboard is full' });
        }
        const [editor, update] = yield index_1.prisma.$transaction([
            index_1.prisma.dashboardUser.create({
                data: {
                    dashboardId,
                    id: (0, uuid_1.v4)(),
                    userId,
                    role: 'EDITOR'
                }
            }),
            index_1.prisma.request.update({
                where: {
                    id: requestId
                },
                data: {
                    status: 'ACCEPTED',
                }
            })
        ]);
        if (!update) {
            return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
        if (!editor) {
            return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to add user' });
        }
        return res.status(types_1.HttpStatusCode.OK).json({ message: 'Request accepted' });
    }
    catch (error) {
        console.log(error);
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.AcceptRequest = AcceptRequest;
const RejectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId, dashboardId } = req.body;
        const reject = yield index_1.prisma.request.update({
            where: {
                id: requestId,
                status: "PENDING",
                dashboardId
            },
            data: {
                status: "REJECTED"
            }
        });
        if (!reject) {
            return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
        return res.status(types_1.HttpStatusCode.OK).json({ message: 'Request rejected' });
    }
    catch (error) {
        console.log(error);
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.RejectRequest = RejectRequest;
const GetRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dashboardId } = req.body;
        const dashboard = yield index_1.prisma.dashboard.findUnique({
            where: {
                id: dashboardId
            }, select: {
                Request: {
                    where: {
                        status: 'PENDING',
                    },
                    select: {
                        userId: true,
                        status: true, id: true
                    }
                }
            }
        });
        if (!dashboard) {
            return res.status(types_1.HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard not found' });
        }
        return res.status(types_1.HttpStatusCode.OK).json({ message: 'Request found', data: dashboard.Request });
    }
    catch (error) {
        console.log(error);
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.GetRequest = GetRequest;
const GetMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dashboardId } = req.body;
        const { _id } = req.user;
        const dashboard = yield index_1.prisma.dashboardUser.findMany({
            where: {
                id: dashboardId,
                userId: {
                    not: _id
                }
            },
            select: {
                userId: true,
            }
        });
        if (!dashboard) {
            return res.status(types_1.HttpStatusCode.NOT_FOUND).json({ message: 'Dashboard not found' });
        }
        return res.status(types_1.HttpStatusCode.OK).json({ message: 'Members found', data: dashboard });
    }
    catch (error) {
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.GetMembers = GetMembers;
const GetDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("GETTING DASHBOARD");
    try {
        const { _id } = req.user;
        const dashboards = yield index_1.prisma.dashboardUser.findMany({
            where: {
                userId: _id,
            },
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
                            }
                        },
                    },
                },
            },
        });
        console.log(dashboards);
        if (!dashboards) {
            return;
        }
        console.log("sending", dashboards);
        return res.status(types_1.HttpStatusCode.OK).json(dashboards);
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.GetDashboard = GetDashboard;
