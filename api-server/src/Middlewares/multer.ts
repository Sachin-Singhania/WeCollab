import multer from "multer";
import path from 'path';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    console.log("I CAM HERE 2");
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads", { recursive: true });
    }
      cb(null, "uploads"); 
  },
  filename: (req, file, cb) => {
    const uniqueName = uuid();
    cb(null, file.fieldname + '-' + uniqueName+ path.extname(file.originalname));
  }
});
export const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 },
});
