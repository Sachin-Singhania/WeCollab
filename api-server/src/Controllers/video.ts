import { Request, Response } from "express";
import { Join, HttpStatusCode, Dashboard,VideoRecived } from "../types/types";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { convertChunksToVideo, convertToHLS, getandcheckAccessToken } from "../utils/feature";
import { prisma } from "..";
import { google } from "googleapis";
export const VideoUploadEditor = async (req: Request, res: Response) => {
    try {
      const { name, description, dashboardId } = req.body;
      const {_id} = req.user;
      if  (!name || !description || !dashboardId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Name, description and dashboard ID are required' });
      }
      const dashboardExists = await prisma.dashboard.findUnique({
        where: { id: dashboardId },
      });
      if (!dashboardExists) {
        return res.status(400).json({ message: 'Dashboard not found' });
      }

      const filepath = req.file?.path;
      if (!filepath) return res.status(400).json({ message: 'File not found' });

      const lessonId = uuid();
      const outputPath = `./uploads/${dashboardId}/${lessonId}`;
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      const video = await convertToHLS(filepath, outputPath, lessonId, res, req, dashboardId);
      if (video.videoUrl && video.videoUrl.trim() !== "") {
        try {
          const videoupload = await prisma.video.create({
            data: {
              id: lessonId,
              name,
              description,
              url: video.videoUrl,
              dashboardId,
              uploadedBy : _id
            },
          });
          await fs.promises.unlink(filepath);
          return res.status(201).json({ message: 'Video uploaded successfully', video: videoupload });
        } catch (error) {
          console.error("Error during Prisma DB call:", error);
          return res.status(500).json({ message: 'Error uploading video' });
        }
      } else {
        return res.status(500).json({ message: 'Video processing failed' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  export const VideoUploadOwner= async (req: Request, res: Response) => {
    try{
      const { name, description, dashboardId } = req.body;
      const _id = req.user._id;
      if  (!name || !description || !dashboardId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Name, description and dashboard ID are required' });
      }

      const dashboardExists = await prisma.dashboard.findUnique({
        where: { id: dashboardId },
      });
      if (!dashboardExists) {
        return res.status(400).json({ message: 'Dashboard not found' });
      }

      const filepath = req.file?.path;
      if (!filepath) return res.status(400).json({ message: 'File not found' });
      const videoupload = await prisma.video.create({
        data: {
          id: uuid(),
          name,
          description,
          url: filepath,
          dashboardId,
          uploadedBy : _id
        },
      });
      return res.status(201).json({ message: 'Video uploaded successfully', video: videoupload });
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
export const getVideo = async (req: Request, res: Response) => {
    try {
         const { dashboardId , lessonId } = req.params;
         if (!dashboardId || !lessonId) {
          return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Dashboard ID and lesson ID are required ' });
         }
         const video = await prisma.video.findUnique({
            where: {
                id: lessonId,
                dashboardId: dashboardId
            },select:{
                id:true,
                name:true,
                description:true,
                url:true,createdAt :true
            }
         });
         if (!video) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Video not found' });
         }
        return res.status(HttpStatusCode.OK).json({ message: 'Video found', video });
    } catch (error) {
        console.log(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        
    }
};
export const getVideos= async (req: Request, res: Response) => {
  try {
    const { dashboardId } = req.params;
    if (!dashboardId) { 
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Dashboard ID is required' });
      }
    const videos = await prisma.video.findMany({
      where: {
        dashboardId: dashboardId
      },select:{
        name :true,
        id :true,
        uploadedBy :true,
      }
    })
    if (!videos) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Videos not found' });
    }
    return res.status(HttpStatusCode.OK).json({ message: 'Videos found', videos });
  } catch (error) {
     console.log(error);
     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
}
//http://localhost:3010/video/api/v1/video/youtube/upload
export const uploadVideotoYoutube = async (req: Request, res: Response) => {
  try {

    const { videoId, dashboardId,title,description,privacyStatus } = req.body;
    if (!videoId || !dashboardId || !title || !description || !privacyStatus) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'All fields are required' });
    }
    const {_id}=req.user;
    console.log("I CAME HERE 2");
     if (!videoId || !dashboardId || !title || !description || !privacyStatus) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Video id and dashboard id are required ' });
     }

     const accessToken = await getandcheckAccessToken(_id);
     if (!accessToken.success){
       return res.status(HttpStatusCode.BAD_GATEWAY).json({ message: accessToken.message });
     }
    const token = accessToken.accessToken;
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        dashboardId: dashboardId,
      },
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const inputPath = `./uploads/${dashboardId}/${videoId}`;
    const outputPath = `./uploads/${dashboardId}/file-${videoId}.mp4`;

    const result = await convertChunksToVideo(inputPath, outputPath);
        if (!result.success) {
          if(fs.existsSync(outputPath))
          await fs.promises.unlink(outputPath);
          return res.status(500).json({ message: result.message });
        }
        
        console.log("Video converted successfully:", result.videoUrl);
        
        const youtube = google.youtube("v3");
        const request = youtube.videos.insert(
          {
            // @ts-ignore
            part: 'snippet,status',
            access_token : token,
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
              body: fs.createReadStream(outputPath), 
            },
          },
          async (err:any, response:any) => {
            if (err) {
              await fs.promises.unlink(outputPath);
              return;
            }
            await prisma.youtubeUpload.create({
              data:{
                id :response.data.id,
                title :title,
                dashboardId :dashboardId,
              }
            })
            await fs.promises.unlink(outputPath);
      }
    );
     return res.json({ message: "Video uploaded successfully"});
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const downloadVideo = async (req: Request, res: Response) => {
  try {
    const { videoId, dashboardId } = req.params;
    if (!videoId || !dashboardId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Video ID and dashboard ID are required' });
    }
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        dashboardId: dashboardId,
      },
    });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const filePath = path.resolve(video.url);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader("Content-Type", "video/mp4");

    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        return res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
