import express, { Request, Response } from "express";
import { Login, User } from "../utils/types";
import { pool } from "../utils/dbConnection";
import bcrypt from "bcryptjs";

import { sign, verify } from "jsonwebtoken";
import parseDecodedToken from "../utils/utils";

const loginRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
loginRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body as Login;
  console.log("username", username);
  console.log("password", password);

  const userSQL = `SELECT * FROM users WHERE username = $1`;
  const findUser = await pool.query(userSQL, [username]);
  const user = findUser.rows[0] as User;

  if (findUser.rowCount === 1) {
    if (user.status === 1) {
      return res.send({
        notification: {
          message: `Verify your email. Thanks.`,
          style: { color: "red" },
          success: false,
        },
      });
    } else {
      console.log("user", user);
      const passwdOk = await bcrypt.compare(password, user.password);
      if (!passwdOk) {
        return res.send({
          notification: {
            message: `Check your password!`,
            style: { color: "red" },
            success: true,
          },
        });
      } else {
        const userToken = {
          username: user.username,
        };

        const token = sign(userToken, "huhuu", { expiresIn: 60 * 60 });
        return res.send({
          token,
          notification: {
            message: `Logged In! Redirecting...`,
            style: { color: "green" },
            success: true,
          },
        });
      }
    }
  }
  return res.send({
    notification: {
      message: `No such user.`,
      style: { color: "darkorange" },
      success: false,
    },
  });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises,
loginRouter.get("/", async (req: Request, res: Response) => {
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
        res.send(user);
      }
    } catch (error: unknown) {
      console.log("ERROR decoding token:", error);
    }
  }
});

export { loginRouter };
