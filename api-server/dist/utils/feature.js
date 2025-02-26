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
exports.convertChunksToVideo = exports.convertToHLS = exports.getandcheckAccessToken = exports.random6DigitCode = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const random6DigitCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.random6DigitCode = random6DigitCode;
const getandcheckAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!userId) {
            return { success: false, message: "User ID is required" };
        }
        const response = yield axios_1.default.get(`http://localhost:3010/user/api/v1/user/refresh-token/${userId}`, {
            withCredentials: true,
        });
        const data = response.data;
        return data;
    }
    catch (error) {
        console.error("Error in getAndCheckAccessToken:", error.message);
        return {
            success: false,
            message: "Failed to fetch access token",
            error: error.response ? error.response.data : error.message,
        };
    }
});
exports.getandcheckAccessToken = getandcheckAccessToken;
const convertToHLS = (filePath, outputPath, lessonId, res, req, dashboardId) => {
    return new Promise((resolve, reject) => {
        console.log(outputPath);
        const segmentFilePath = `${outputPath}/segment%03d.ts`;
        const playlistFilePath = `${outputPath}/index.m3u8`;
        const baseUrl = 'http://localhost:8080';
        (0, fluent_ffmpeg_1.default)(filePath)
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
            const response = {
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
            const response = {
                success: false,
                message: 'Error converting video to HLS format'
            };
            res.status(500).json(response);
            reject(new Error('Video conversion failed')); // Reject the promise in case of error
        })
            .run();
    });
};
exports.convertToHLS = convertToHLS;
const convertChunksToVideo = (chunksDir, outputFilePath) => {
    return new Promise((resolve, reject) => {
        const playlistFile = path_1.default.join(chunksDir, 'index.m3u8');
        if (!fs_1.default.existsSync(playlistFile)) {
            return reject({ success: false, message: "Playlist file not found" });
        }
        (0, fluent_ffmpeg_1.default)(playlistFile)
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
exports.convertChunksToVideo = convertChunksToVideo;
