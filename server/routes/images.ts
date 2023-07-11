import express, { Request, Response } from "express";

const imageRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/require-await
imageRouter.post("/", (req: Request, res: Response) => {
  const userId = Number(req.body.userId);
  console.log("back userId", userId);
  console.log("req.body", req.body);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // const { filename } = req.file;
  console.log("hi!");
  res.sendStatus(200);
});

export { imageRouter };
