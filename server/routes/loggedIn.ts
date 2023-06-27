import express from "express";
// import { authToken } from "../utils/utils";

const loggedRouter = express.Router();

// loggedRouter.get("/", authToken, (req: Request, _res: Response) => {
//   const user = req.user;
//   console.log("user", user);
// });

export { loggedRouter };
