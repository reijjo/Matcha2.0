import express, { Request, Response } from "express";
import { pool } from "../utils/dbConnection";
// import { User } from "../utils/types";

const usersRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const sql = `SELECT * FROM users`;
    const result = await pool.query(sql);

    console.log("RESULT", result.rows);
    res.json(result.rows);
  } catch (error: unknown) {
    console.error("GET Users", error);
    // res.status(500).send("Internal Server Error");
  }
});

export { usersRouter };
