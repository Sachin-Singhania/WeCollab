import nodemailer from 'nodemailer';
import ffmpeg from "fluent-ffmpeg"
import { Response, Request } from 'express';
import { ConvertToHLSResponse } from '../types/types';
import axios from 'axios';
import path from 'path';
import fs from 'fs';



export const random6DigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
}

export const getandcheckAccessToken = async (userId:string) =>{
  try {
    if (!userId) {
      return { success:false,message: "User ID is required" };
    }

    const response = await axios.get(`http://localhost:3010/user/api/v1/user/refresh-token/${userId}`, {
        withCredentials: true,
    });
    const data = response.data;
    return data;
} catch (error: any) {
    console.error("Error in getAndCheckAccessToken:", error.message);
    return {
        success: false,
        message: "Failed to fetch access token",
        error: error.response ? error.response.data : error.message,
    };
}
}
export const convertToHLS = (filePath: string, outputPath: string, lessonId: string, res: Response, req: Request,dashboardId:string): Promise<ConvertToHLSResponse> => {
  return new Promise((resolve, reject) => {
    console.log( outputPath);
    const segmentFilePath = `${outputPath}/segment%03d.ts`;
    const playlistFilePath = `${outputPath}/index.m3u8`;
    const baseUrl = 'http://localhost:8080';

    ffmpeg(filePath)
      .outputOptions([
        '-codec:v libx264',
        '-codec:a aac',
        '-hls_time 10',
        '-hls_playlist_type vod',
        `-hls_segment_filename ${segmentFilePath}`,
        '-start_number 0'
      ])
      .output(playlistFilePath)
      .on('end', () => {
        const videoUrl = `${baseUrl}/uploads/${dashboardId}/${lessonId}/index.m3u8`;

        const response: ConvertToHLSResponse = {
          success: true,
          message: 'Video converted to HLS format',
          videoUrl: videoUrl,
          lessonId: lessonId
        };

        resolve(response); // Resolve the promise after the operation is done
        return response;
      })
      .on('error', (err, stdout, stderr) => {
        console.log(`Error: ${err.message}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        const response: ConvertToHLSResponse = {
          success: false,
          message: 'Error converting video to HLS format'
        };

        res.status(500).json(response);
        reject(new Error('Video conversion failed')); // Reject the promise in case of error
      })
      .run();
  });
};
export const convertChunksToVideo = (
  chunksDir: string,
  outputFilePath: string
): Promise<{ success: boolean; message: string; videoUrl?: string }> => {
  return new Promise((resolve, reject) => {
    const playlistFile = path.join(chunksDir, 'index.m3u8');

    if (!fs.existsSync(playlistFile)) {
      return reject({ success: false, message: "Playlist file not found" });
    }

    ffmpeg(playlistFile)
      .outputOptions(["-c copy", "-bsf:a aac_adtstoasc"])
      .output(outputFilePath)
      .on("end", () => {
        resolve({ success: true, message: "Video successfully reconstructed", videoUrl: outputFilePath });
      })
      .on("error", (err) => {
        reject({ success: false, message: "Error converting chunks to video" });
      })
      .run();
  });
};


