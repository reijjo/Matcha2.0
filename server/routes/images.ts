/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import multer, { Multer } from "multer";
import fs from "fs";
import path from "path";
import { pool } from "../utils/dbConnection";

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

    const baseUrl = "http://localhost:3001";
    const newFilePath = path.join(userDir, req.file.filename);

    if (filePath) {
      fs.rename(filePath, newFilePath, async (err) => {
        if (err) {
          console.log("Error moving file", err);
        } else {
          const picCheck = `SELECT * FROM images WHERE user_id = $1`;
          const picResult = await pool.query(picCheck, [userId]);
          if (picResult.rowCount < 5) {
            const checkAvatar = `SELECT * FROM images WHERE user_id = $1 AND avatar = $2`;
            const avatarResult = await pool.query(checkAvatar, [userId, true]);
            if (avatarResult.rowCount === 0) {
              const addPic = `INSERT INTO images (user_id, path, avatar, created_at)
										VALUES ($1, $2, $3, NOW())`;
              const addPicResult = await pool.query(addPic, [
                userId,
                `${baseUrl}${newFilePath}`,
                true,
              ]);
              console.log("PICCCSS", addPicResult);
              res.send({
                imgNotify: true,
                notification: {
                  message: "Image uploaded.",
                  style: { color: "green" },
                  success: true,
                },
              });
            } else {
              const addPic = `INSERT INTO images (user_id, path, avatar, created_at)
							VALUES ($1, $2, $3, NOW())`;
              const addPicResult = await pool.query(addPic, [
                userId,
                `${baseUrl}${newFilePath}`,
                false,
              ]);
              res.send({
                imgNotify: true,
                notification: {
                  message: "Image uploaded.",
                  style: { color: "green" },
                  success: true,
                },
              });
              console.log("PICCCSS", addPicResult);
            }
          } else {
            fs.unlink(newFilePath, (err) => {
              if (err) {
                console.log("Error deleting file", err);
              } else {
                console.log("File deleted");
              }
            });

            res.send({
              imgNotify: true,
              notification: {
                message: "Max 5 Images.",
                style: { color: "red" },
                success: false,
              },
            });
          }
          console.log("PICRES", picResult);
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
    // res.sendStatus(200);
  }
});

imageRouter.get("/", async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  const findPhotos = `SELECT path FROM images WHERE user_id = $1`;
  const findEm = await pool.query(findPhotos, [userId]);

  res.json(findEm.rows);
  console.log("jee taal ollaan");
});

export { imageRouter };
