/* eslint-disable @typescript-eslint/no-unsafe-return */
import express, { Response, Request } from "express";
import { pool } from "../utils/dbConnection";
// import { User } from "../utils/types";
import { Looking } from "../utils/types";
// import { QueryResult } from "pg";

const profileRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
profileRouter.get("/", async (req: Request, res: Response) => {
  const user = req.query;
  const offset = req.query.offset as string;
  const limit = req.query.limit as string;

  // console.log("USERID", user.user.id);

  console.log("offset", offset);
  console.log("limit", limit);

  try {
    const findLookingSql = `SELECT seeking FROM profile WHERE user_id = $1`;
    const lookingres = await pool.query(findLookingSql, [user.id]);

    console.log("LOO", lookingres.rows);
    const seeking = lookingres.rows[0].seeking as Looking;

    let profileSql;
    let profileRes;

    if (seeking === Looking.Male || seeking === Looking.Female) {
      profileSql = `
      SELECT * FROM profile WHERE user_id != $1 AND gender = $2 OFFSET $3 LIMIT $4
    `;
      profileRes = await pool.query(profileSql, [
        user.id,
        seeking,
        offset,
        limit,
      ]);
    } else {
      profileSql = `
      SELECT * FROM profile WHERE user_id != $1  OFFSET $2 LIMIT $3
    `;
      profileRes = await pool.query(profileSql, [user.id, offset, limit]);
    }

    // console.log(profileRes.rowCount);

    // const imageSql = `SELECT * FROM images WHERE avatar = $1`;
    // const imageRes = await pool.query(imageSql, [true]);

    res.send({
      profile: profileRes.rows,
      // images: imageRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profiles" });
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
profileRouter.get("/profile/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const get = `SELECT * FROM profile WHERE user_id = $1`;
  const send = await pool.query(get, [id]);

  // console.log("SENDD", send.rows[0] as QueryResult);
  res.send(send.rows[0]);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
profileRouter.post("/profile/:id", async (req: Request, _res: Response) => {
  const { id } = req.params;
  const userId = req.body.userId as string;

  const dupCheckSql = `SELECT * FROM stalkers WHERE user_id = $1 AND stalked_id = $2`;
  const dupCheckRes = await pool.query(dupCheckSql, [userId, id]);

  if (dupCheckRes.rowCount === 0) {
    const addSql = `INSERT INTO stalkers (user_id, stalked_id) VALUES ($1, $2)`;
    await pool.query(addSql, [userId, id]);
  }

  console.log("profile, me", id, userId);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
profileRouter.get("/me", async (req: Request, res: Response) => {
  const id = req.query.id;

  const lookedSql = `SELECT * FROM stalkers WHERE user_id = $1`;
  const lookedRes = await pool.query(lookedSql, [id]);
  const lookedMap = lookedRes.rows.map((row) => row.stalked_id);
  const lookedUserSql = `SELECT * FROM users WHERE id = ANY($1::int[])`;
  const lookedUserRes = await pool.query(lookedUserSql, [lookedMap]);
  const lookedCoorsSql = `SELECT * FROM profile WHERE user_id = ANY($1::int[])`;
  const lookedCoorsRes = await pool.query(lookedCoorsSql, [lookedMap]);

  const stalkersSql = `SELECT * FROM stalkers WHERE stalked_id = $1`;
  const stalkersRes = await pool.query(stalkersSql, [id]);
  const stalkersMap = stalkersRes.rows.map((row) => row.user_id);
  console.log("stalk", stalkersMap);
  const stalkersUserSql = `SELECT * FROM users WHERE id = ANY($1::int[])`;
  const stalkersUserRes = await pool.query(stalkersUserSql, [stalkersMap]);
  const stalkersCoorsSql = `SELECT * FROM profile WHERE user_id = ANY($1::int[])`;
  const stalkersCoorsRes = await pool.query(stalkersCoorsSql, [lookedMap]);

  res.send({
    looked: lookedUserRes.rows,
    lookedCoors: lookedCoorsRes.rows,
    stalkers: stalkersUserRes.rows,
    stalkersCoors: stalkersCoorsRes.rows,
  });
});

export { profileRouter };