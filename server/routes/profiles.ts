import express, { Response, Request } from "express";
// import { User } from "../utils/types";
import { pool } from "../utils/dbConnection";
import { Looking } from "../utils/types";

const profileRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
profileRouter.get("/", async (req: Request, res: Response) => {
  const user = req.query;

  console.log("user", user);

  try {
    const findLookingSql = `SELECT seeking FROM profile WHERE user_id = $1`;
    const lookingres = await pool.query(findLookingSql, [user.id]);

    console.log("LOO", lookingres.rows);
    const seeking = lookingres.rows[0].seeking as Looking;

    let profileSql;
    let profileRes;

    if (seeking === Looking.Male || seeking === Looking.Female) {
      profileSql = `
      SELECT * FROM profile WHERE user_id != $1 AND gender = $2 ORDER BY RANDOM()
    `;
      profileRes = await pool.query(profileSql, [user.id, seeking]);
    } else {
      profileSql = `
      SELECT * FROM profile WHERE user_id != $1  ORDER BY RANDOM()
    `;
      profileRes = await pool.query(profileSql, [user.id]);
    }

    console.log(profileRes.rowCount);

    const imageSql = `SELECT * FROM images WHERE avatar = $1`;
    const imageRes = await pool.query(imageSql, [true]);

    res.send({ profile: profileRes.rows, images: imageRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profiles" });
  }
});

export { profileRouter };
