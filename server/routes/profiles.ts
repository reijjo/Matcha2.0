import express, { Response, Request } from "express";
// import { Profile, User } from "../utils/types";
import { pool } from "../utils/dbConnection";

const profileRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
profileRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const profileSql = `
      SELECT * FROM profile ORDER BY RANDOM()
    `;
    const profileRes = await pool.query(profileSql);

    const imageSql = `SELECT * FROM images WHERE avatar = $1`;
    const imageRes = await pool.query(imageSql, [true]);

    res.send({ profile: profileRes.rows, images: imageRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profiles" });
  }
});

// usersRouter.get("/", async (_req: Request, res: Response) => {
//   try {
//     const sql = `SELECT * FROM users`;
//     const result = await pool.query(sql);

//     console.log("RESULT", result.rows);
//     res.json(result.rows);
//   } catch (error: unknown) {
//     console.error("GET Users", error);
//     // res.status(500).send("Internal Server Error");
//   }
// });

export { profileRouter };
