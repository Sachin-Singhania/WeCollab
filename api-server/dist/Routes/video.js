"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const video_1 = require("../Controllers/video");
const multer_1 = require("../Middlewares/multer");
const verify_1 = require("../Middlewares/verify");
const router = express_1.default.Router();
router.post('/upload-editor', multer_1.upload.single('file'), video_1.VideoUploadEditor);
router.post('/upload-owner', multer_1.upload.single('file'), video_1.VideoUploadOwner);
router.get('/:dashboardId/:lessonId', video_1.getVideo);
router.post('/youtube/upload', verify_1.isAuthenticated, video_1.uploadVideotoYoutube);
exports.default = router;
