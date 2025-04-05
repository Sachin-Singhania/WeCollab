import multer from "multer";
import path from 'path';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { dashboardId } = req.body;
      console.log("Received dashboardId:", dashboardId); 
    const dashboardPath = path.join("uploads", dashboardId);
    if (!fs.existsSync(dashboardPath)) {
      fs.mkdirSync(dashboardPath, { recursive: true });
    }
      cb(null, dashboardPath); 
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
