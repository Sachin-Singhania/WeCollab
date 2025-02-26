import express from "express"
import { getVideo, getVideos, uploadVideotoYoutube, VideoUploadEditor, VideoUploadOwner } from "../Controllers/video";
import { upload } from "../Middlewares/multer";
import { isAuthenticated } from "../Middlewares/verify";
const router = express.Router();
router.post('/upload-editor',upload.single('file'),VideoUploadEditor as unknown as express.RequestHandler );
router.post('/upload-owner',upload.single('file'),VideoUploadOwner as unknown as express.RequestHandler );
router.get('/:dashboardId/:lessonId',getVideo as unknown as express.RequestHandler );
router.post('/youtube/upload',isAuthenticated as unknown as express.RequestHandler,uploadVideotoYoutube as unknown as express.RequestHandler );
export default router;