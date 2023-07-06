import express, { Request, Response, NextFunction } from "express";
// import { authToken } from "../utils/utils";
import parseDecodedToken from "../utils/utils";
import { pool } from "../utils/dbConnection";
import { User } from "../utils/types";
import { verify } from "jsonwebtoken";

const loggedRouter = express.Router();

interface CustomReq extends Request {
  user?: User;
}

export const verifyToken = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = verify(token, "huhuu");
      const userPayload = parseDecodedToken(decodedToken);
      const userSQL = `SELECT * FROM users WHERE username = $1`;
      const findUser = await pool.query(userSQL, [userPayload.username]);
      const user = findUser.rows[0] as User;
      // console.log("hai", userPayload.username);
      if (user) {
        req.user = user;
        next();
        // res.send({ user: req.user });
      } else {
        res.send({ message: "Invalid token!" });
      }
    } catch (error: unknown) {
      console.log("ERROR decoding token:", error);
      res.send({ error: "Invalid / Expired Token." });
    }
  } else {
    res.send({ message: "No token at all!" });
  }
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
loggedRouter.get("/", verifyToken, (req: CustomReq, res: Response) => {
  const user = req.user;
  if (user) {
    console.log("user", user);
    res.send(user);
  } else {
    res.send({ error: "Invalid / Expired Token!" });
  }
});

export { loggedRouter };
