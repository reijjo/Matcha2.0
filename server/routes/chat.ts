/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { pool } from "../utils/dbConnection";

const chatRouter = express.Router();

chatRouter.get("/", async (_req: Request, res: Response) => {
  const msgs = `SELECT * FROM messages`;
  const getMsgs = await pool.query(msgs);

  res.send(getMsgs.rows);
});

chatRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const me = req.query.me;
  console.log("BACK me", me);
  console.log("BACK other", id);

  const chatSql = `SELECT * FROM messages WHERE sender_id = $1 AND to_id = $2`;
  const chatRes = await pool.query(chatSql, [me, id]);

  const mynameSql = `SELECT * FROM users WHERE id = $1`;
  const mynameRes = await pool.query(mynameSql, [me]);

  const othernameSql = `SELECT * FROM users WHERE id = $1`;
  const othernameRes = await pool.query(othernameSql, [id]);

  // console.log(mynameRes.rows[0]);

  res.send({
    chat: chatRes.rows,
    myName: mynameRes.rows[0],
    otherName: othernameRes.rows[0],
  });
});

export { chatRouter };
