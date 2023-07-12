import express, { Request, Response } from "express";
import multer, { Multer } from "multer";
import fs from "fs";
import path from "path";

const imageRouter = express.Router();

const uploadDir = path.join(__dirname, `../uploads`);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("uploads/ folder created!");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // const userId = String(req.body.userId);
    // const userDir = path.join(uploadDir, userId);
    // if (!fs.existsSync(userDir)) {
    //   fs.mkdirSync(userDir);
    // }
    // cb(null, userDir);
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqSuffix = Date.now() + "-" + Math.round(Math.random() * 5000);
    const extension = path.extname(file.originalname);
    cb(null, uniqSuffix + extension);
  },
});

const upload: Multer = multer({ storage: storage });

// eslint-disable-next-line @typescript-eslint/require-await
imageRouter.post("/", upload.single("image"), (req: Request, res: Response) => {
  const userId = String(req.body.userId);
  if (req.file) {
    const filePath = req.file?.path;

    const userDir = path.join(uploadDir, userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
    }

    if (filePath) {
      fs.rename(filePath, path.join(userDir, req.file.filename), (err) => {
        if (err) {
          console.log("Error moving file", err);
        } else {
          console.log("jee");
        }
      });
    } else {
      console.log("FIle Path is undefined.");
    }

    console.log("back userId", userId);
    console.log("back FILEPATH", filePath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const { filename } = req.file;
    console.log("hi!");
    res.sendStatus(200);
  }
});

export { imageRouter };
