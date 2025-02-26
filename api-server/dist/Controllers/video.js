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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideotoYoutube = exports.getVideos = exports.getVideo = exports.VideoUploadOwner = exports.VideoUploadEditor = void 0;
const types_1 = require("../types/types");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const feature_1 = require("../utils/feature");
const __1 = require("..");
const googleapis_1 = require("googleapis");
const VideoUploadEditor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("I CAM HERE 1");
    try {
        const { name, description, dashboardId } = req.body;
        if (!dashboardId) {
            return res.status(400).json({ message: 'Dashboard ID is required' });
        }
        const dashboardExists = yield __1.prisma.dashboard.findUnique({
            where: { id: dashboardId },
        });
        if (!dashboardExists) {
            return res.status(400).json({ message: 'Dashboard not found' });
        }
        const filepath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!filepath)
            return res.status(400).json({ message: 'File not found' });
        const lessonId = (0, uuid_1.v4)();
        const outputPath = `./uploads/${dashboardId}/${lessonId}`;
        if (!fs_1.default.existsSync(outputPath)) {
            fs_1.default.mkdirSync(outputPath, { recursive: true });
        }
        const video = yield (0, feature_1.convertToHLS)(filepath, outputPath, lessonId, res, req, dashboardId);
        if (video.videoUrl && video.videoUrl.trim() !== "") {
            try {
                const videoupload = yield __1.prisma.video.create({
                    data: {
                        id: lessonId,
                        name,
                        description,
                        url: video.videoUrl,
                        dashboardId,
                    },
                });
                yield fs_1.default.promises.unlink(outputPath);
                return res.status(201).json({ message: 'Video uploaded successfully', video: videoupload });
            }
            catch (error) {
                console.error("Error during Prisma DB call:", error);
                return res.status(500).json({ message: 'Error uploading video' });
            }
        }
        else {
            return res.status(500).json({ message: 'Video processing failed' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.VideoUploadEditor = VideoUploadEditor;
const VideoUploadOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, dashboardId } = req.body;
        if (!dashboardId) {
            return res.status(400).json({ message: 'Dashboard ID is required' });
        }
        const dashboardExists = yield __1.prisma.dashboard.findUnique({
            where: { id: dashboardId },
        });
        if (!dashboardExists) {
            return res.status(400).json({ message: 'Dashboard not found' });
        }
        const filepath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!filepath)
            return res.status(400).json({ message: 'File not found' });
        const videoupload = yield __1.prisma.video.create({
            data: {
                id: (0, uuid_1.v4)(),
                name,
                description,
                url: filepath,
                dashboardId,
            },
        });
        return res.status(201).json({ message: 'Video uploaded successfully', video: videoupload });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.VideoUploadOwner = VideoUploadOwner;
const getVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dashboardId, lessonId } = req.params;
        const video = yield __1.prisma.video.findUnique({
            where: {
                id: lessonId,
                dashboardId: dashboardId
            }, select: {
                id: true,
                name: true,
                description: true,
                url: true
            }
        });
        if (!video) {
            return res.status(types_1.HttpStatusCode.NOT_FOUND).json({ message: 'Video not found' });
        }
        return res.status(types_1.HttpStatusCode.OK).json({ message: 'Video found', video });
    }
    catch (error) {
        console.log(error);
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.getVideo = getVideo;
const getVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dashboardId } = req.params;
        const videos = yield __1.prisma.video.findMany({
            where: {
                dashboardId: dashboardId
            }, select: {
                name: true,
                id: true,
            }
        });
        if (!videos) {
            return res.status(types_1.HttpStatusCode.NOT_FOUND).json({ message: 'Videos not found' });
        }
        return res.status(types_1.HttpStatusCode.OK).json({ message: 'Videos found', videos });
    }
    catch (error) {
        console.log(error);
        return res.status(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});
exports.getVideos = getVideos;
const uploadVideotoYoutube = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId, dashboardId, title, description, privacyStatus } = req.body;
        const { _id } = req.user;
        console.log("I CAME HERE 2");
        if (!videoId || !dashboardId || !title || !description || !privacyStatus) {
            return res.status(types_1.HttpStatusCode.BAD_REQUEST).json({ message: 'Video id and dashboard id are required ' });
        }
        const accessToken = yield (0, feature_1.getandcheckAccessToken)(_id);
        console.log(accessToken);
        console.log("I CAME HERE 3");
        if (!accessToken.success) {
            return res.status(types_1.HttpStatusCode.BAD_GATEWAY).json({ message: accessToken.message });
        }
        const token = accessToken.accessToken;
        const video = yield __1.prisma.video.findUnique({
            where: {
                id: videoId,
                dashboardId: dashboardId,
            },
        });
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        const inputPath = `./uploads/${dashboardId}/${videoId}`; // Directory with HLS chunks
        const outputPath = `./uploads/${dashboardId}/file-${videoId}.mp4`; // Merged video output
        console.log("I CAME HERE 4");
        const result = yield (0, feature_1.convertChunksToVideo)(inputPath, outputPath);
        console.log("I CAME HERE 5");
        if (!result.success) {
            return res.status(500).json({ message: result.message });
        }
        console.log("Video converted successfully:", result.videoUrl);
        const youtube = googleapis_1.google.youtube("v3");
        console.log("I CAME HERE 6");
        const request = youtube.videos.insert({
            // @ts-ignore
            part: 'snippet,status',
            access_token: token,
            requestBody: {
                snippet: {
                    title,
                    description,
                },
                status: {
                    privacyStatus,
                },
            },
            media: {
                body: fs_1.default.createReadStream(outputPath),
            },
        }, (err, response) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error uploading video:', err);
                return;
            }
            console.log("I CAME HERE 7");
            console.log('Video uploaded. Video ID:', response.data);
            yield fs_1.default.promises.unlink(outputPath);
        }));
        return res.json({ message: "Video uploaded successfully" });
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.uploadVideotoYoutube = uploadVideotoYoutube;
