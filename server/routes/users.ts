import express, { Request, Response } from "express";
import { pool } from "../utils/dbConnection";
import { Profile, User } from "../utils/types";
import { config } from "../utils/config";
import bcrypt from "bcryptjs";
import { scryptSync, randomBytes } from "crypto";
import nodemailer from "nodemailer";
import checks from "../utils/differentChecks";
// import { QueryResult } from "pg";
// import { Options } from "nodemailer/lib/mailer";

const usersRouter = express.Router();

// const isEmpty = (obj: object): boolean => {
// 	return Object.keys(obj).length === 0;
// }

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const sql = `SELECT * FROM users`;
    const result = await pool.query(sql);

    // console.log("RESULT", result.rows);
    res.json(result.rows);
  } catch (error: unknown) {
    console.error("GET Users", error);
    // res.status(500).send("Internal Server Error");
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.post("/", async (req: Request, res: Response) => {
  const user = req.body as User;
  // if (user) {
  const usernameNotif = checks.usernameCheck(user.username);
  const emailNotif = checks.emailCheck(user.email);
  const firstNotif = checks.firstCheck(user.firstname);
  const lastNotif = checks.lastCheck(user.lastname);
  const ageNotif = checks.ageCheck(user.birthday);
  const passwdNotif = checks.passwdCheck(user.password);

  if (usernameNotif) {
    return res.send({ notification: usernameNotif });
  } else if (emailNotif) {
    return res.send({ notification: emailNotif });
  } else if (firstNotif) {
    return res.send({ notification: firstNotif });
  } else if (lastNotif) {
    return res.send({ notification: lastNotif });
  } else if (ageNotif) {
    return res.send({ notification: ageNotif });
  } else if (passwdNotif) {
    return res.send({ notification: passwdNotif });
  } else if (user.password !== user.confPassword) {
    return res.send({
      notification: {
        message: "Passwords doesn't match.",
        style: { color: "red" },
        success: false,
      },
    });
  } else {
    const passwdHash: string = await bcrypt.hash(user.password, 10);
    const salt = randomBytes(16).toString("hex");
    const hashUser = scryptSync(user.username + user.password, salt, 64);
    const codeHash = `${hashUser.toString("hex")}`;

    const sendVerifyCode = () => {
      const transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASSWD,
        },
      });

      const options = {
        from: config.EMAIL_USER,
        to: user.email,
        subject: "HEY! Verify your Matcha account!",
        html: `
					<h3>click the link</h3><br />
					<a href="http://localhost:3000/${codeHash}/verify"> HERE </a><br />
					<p>Thanks.</p>`,
      };

      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log("ERROR sending mail: ", err);
        } else {
          console.log("Email sent: ", info);
        }
      });
    };

    try {
      const duplicateCheck = `SELECT * FROM users WHERE username = $1 OR email = $2`;
      const duplicateResult = await pool.query(duplicateCheck, [
        user.username,
        user.email,
      ]);
      if (duplicateResult.rowCount > 0) {
        return res.send({
          notification: {
            message: "Username / Email already exists.",
            style: { color: "red" },
            success: false,
          },
        });
      } else {
        const addUserToDB = `INSERT INTO users
					(username, firstname, lastname, email, birthday, password, verifycode, status, online)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`;
        await pool.query(addUserToDB, [
          user.username,
          user.firstname,
          user.lastname,
          user.email,
          user.birthday,
          passwdHash,
          codeHash,
          1,
        ]);
        sendVerifyCode();
      }
    } catch (error: unknown) {
      console.log("ERROR on duplicate check: ", error);
    }
  }
  // }
  console.log("BACKUSER", user);
  console.log("EMAILSTUFF", config.EMAIL_USER);
  console.log("EMAILSTUFF2", config.EMAIL_PASSWD);
  return res.send({
    notification: {
      message: `Registration email sent to '${user.email}'`,
      style: { color: "green" },
      success: true,
    },
  });
});

// API/USERS/:ID
// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.get("/:code/verify", async (req: Request, res: Response) => {
  const code = req.params.code;
  console.log("VerifyUser", code);

  const sql = `SELECT * FROM users WHERE verifycode = $1`;
  const result = await pool.query(sql, [code]);
  if (result.rows.length > 0) {
    const updateStatus = `UPDATE users SET status = $1 WHERE verifycode = $2`;
    await pool.query(updateStatus, [2, code]);
    res.json(result.rows[0]);
  } else {
    res.json({ message: "WHAT" });
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.get("/ipapi", async (_req: Request, res: Response) => {
  const myIp = await fetch("https://ipapi.co/json");
  const ipData: unknown = await myIp.json();
  // console.log("MUN", ipData);
  res.send(ipData);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.get("/opencage", async (req: Request, res: Response) => {
  const { x, y } = req.query;
  const newCity = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${y}+${x}&key=9417497716084e0dbb126edbc6037872`
  );
  const cityData: unknown = await newCity.json();
  res.send(cityData);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
usersRouter.post("/regTwo", async (req: Request, res: Response) => {
  const userProfile = req.body as Profile;

  const genderNotif = checks.genderCheck(userProfile.gender);
  const lookingNotif = checks.lookingCheck(userProfile.seeking);
  const bioNotif = checks.bioCheck(userProfile.bio);
  const tagsNotif = checks.tagCheck(userProfile.tags);

  if (genderNotif) {
    return res.send({ notification: genderNotif });
  } else if (lookingNotif) {
    return res.send({ notification: lookingNotif });
  } else if (bioNotif) {
    return res.send({ notification: bioNotif });
  } else if (tagsNotif) {
    return res.send({ notification: tagsNotif });
  } else {
    console.log("userProfile", userProfile);
    const profileSql = `INSERT INTO profile
			(user_id, username, firstname, lastname, email, birthday, password, location, coordinates, gender, seeking, tags, bio, fame, online)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, point($9, $10), $11, $12, $13, $14, $15, NOW() )`;

    try {
      const makeProfile = await pool.query(profileSql, [
        userProfile.user_id,
        userProfile.username,
        userProfile.firstname,
        userProfile.lastname,
        userProfile.email,
        userProfile.birthday,
        userProfile.password,
        userProfile.location,
        userProfile.coordinates.x,
        userProfile.coordinates.y,
        userProfile.gender,
        userProfile.seeking,
        userProfile.tags,
        userProfile.bio,
        10,
      ]);

      if (makeProfile.rowCount === 1) {
        const checkStatus = `SELECT * FROM images WHERE user_id = $1`;
        const newStatus = await pool.query(checkStatus, [userProfile.user_id]);

        if (newStatus.rowCount > 0) {
          const updateSt = `UPDATE users SET status = $1 WHERE id = $2`;
          await pool.query(updateSt, [4, userProfile.user_id]);
        } else {
          const updateSt = `UPDATE users SET status = $1 WHERE id = $2`;
          await pool.query(updateSt, [3, userProfile.user_id]);
        }
        return res.sendStatus(200);
      } else {
        return res.status(500).send({ error: "Update status problems." });
      }
    } catch (error: unknown) {
      return (
        res
          // .status(500)
          .send({ error: "Something wrong with the profile." })
      );
    }
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.post("/forgot", async (req: Request, res: Response) => {
  const lookfor = req.body.email as string;

  const emailNotif = checks.emailCheck(lookfor);

  if (emailNotif) {
    return res.send({ notification: emailNotif });
  } else {
    const whatEmail = `SELECT * FROM users WHERE email = $1`;
    const resEmail = await pool.query(whatEmail, [lookfor]);

    // console.log("WHAT EMAILLL", whatEmail);
    console.log("WHAT EMAILLL", resEmail.rows[0]);

    if (resEmail.rowCount === 0) {
      return res.send({
        notification: {
          message: `No such email.`,
          style: { color: "red" },
          success: true,
        },
      });
    } else {
      console.log("RES EMAIL", resEmail.rowCount);
      const codeHash = (await resEmail.rows[0].verifycode) as string;

      const sendVerifyCode = () => {
        const transporter = nodemailer.createTransport({
          service: "outlook",
          auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASSWD,
          },
        });

        const options = {
          from: config.EMAIL_USER,
          to: lookfor,
          subject: "MATCHA!! Change password link.",
          html: `
						<h3>click the link</h3><br />
						<a href="http://localhost:3000/${codeHash}/forgot"> the link </a><br />
						<p>Thanks.</p>`,
        };

        transporter.sendMail(options, (err, info) => {
          if (err) {
            console.log("ERROR sending mail: ", err);
          } else {
            console.log("Email sent: ", info);
          }
        });
      };

      sendVerifyCode();

      console.log("codehash", codeHash);

      return res.send({
        notification: {
          message: `Link sent to EMAILLL`,
          style: { color: "green" },
          success: true,
        },
      });
    }
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.post("/:code/forgot", async (req: Request, res: Response) => {
  const passwd = req.body.password as string;
  const passwd2 = req.body.confPassword as string;
  const username = req.body.username as string;

  console.log(passwd, passwd2, username);
  const passwdNotif = checks.passwdCheck(passwd);

  if (passwdNotif) {
    return res.send({ notification: passwdNotif });
  } else if (passwd !== passwd2) {
    return res.send({
      notification: {
        message: "Passwords doesn't match.",
        style: { color: "red" },
        success: false,
      },
    });
  } else {
    const passwdHash: string = await bcrypt.hash(passwd, 10);
    const userPw = `UPDATE users SET password = $1 WHERE username = $2`;
    const profilePw = `UPDATE profile SET password = $1 WHERE username = $2`;

    const doUser = await pool.query(userPw, [passwdHash, username]);
    if (doUser.rowCount === 1) {
      const doProfile = await pool.query(profilePw, [passwdHash, username]);
      if (doProfile.rowCount === 1) {
        return res.send({
          notification: {
            message: "Woopwoop, you got a new password!",
            style: { color: "green" },
            success: true,
          },
        });
      } else {
        return res.send({
          notification: {
            message: "Something went wrong.",
            style: { color: "red" },
            success: true,
          },
        });
      }
    } else {
      return res.send({
        notification: {
          message: "Something went wrong.",
          style: { color: "red" },
          success: true,
        },
      });
    }
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.get("/settings", async (req: Request, res: Response) => {
  const userId = req.query.id;

  const profileSql = `SELECT * FROM profile WHERE user_id = $1`;
  const imageSql = `SELECT * FROM images WHERE user_id = $1 ORDER BY id ASC`;

  const profileRes = await pool.query(profileSql, [userId]);
  const imageRes = await pool.query(imageSql, [userId]);

  // console.log(profileRes.rows[0]);

  res.send({ profile: profileRes.rows, image: imageRes.rows });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.put("/settings", async (req: Request, res: Response) => {
  const user = req.body as Profile;
  console.log('USER", ', user);

  const usernameNotif = checks.usernameCheck(user.username);
  const emailNotif = checks.emailCheck(user.email);
  const firstNotif = checks.firstCheck(user.firstname);
  const lastNotif = checks.lastCheck(user.lastname);
  const ageNotif = checks.ageCheck(user.birthday);
  const genderNotif = checks.genderCheck(user.gender);
  const lookingNotif = checks.lookingCheck(user.seeking);
  const bioNotif = checks.bioCheck(user.bio);
  const tagsNotif = checks.tagCheck(user.tags);

  if (usernameNotif) {
    return res.send({ notification: usernameNotif });
  } else if (emailNotif) {
    return res.send({ notification: emailNotif });
  } else if (firstNotif) {
    return res.send({ notification: firstNotif });
  } else if (lastNotif) {
    return res.send({ notification: lastNotif });
  } else if (ageNotif) {
    return res.send({ notification: ageNotif });
  } else if (genderNotif) {
    return res.send({ notification: genderNotif });
  } else if (lookingNotif) {
    return res.send({ notification: lookingNotif });
  } else if (bioNotif) {
    return res.send({ notification: bioNotif });
  } else if (tagsNotif) {
    return res.send({ notification: tagsNotif });
  } else {
    const updateProfile = `UPDATE profile SET username = $1, firstname = $2, lastname = $3, email = $4, birthday = $5,
    	location = $6, coordinates = POINT($7, $8), gender = $9, seeking = $10, bio = $11, tags = $12 WHERE user_id = $13`;

    try {
      const update = await pool.query(updateProfile, [
        user.username,
        user.firstname,
        user.lastname,
        user.email,
        user.birthday,
        user.location,
        user.coordinates.x,
        user.coordinates.y,
        user.gender,
        user.seeking,
        user.bio,
        user.tags,
        user.user_id,
      ]);

      if (update.rowCount === 1) {
        const updateUserSql = `UPDATE users SET username = $1, firstname = $2, lastname = $3, email = $4, birthday = $5 WHERE id = $6`;

        await pool.query(updateUserSql, [
          user.username,
          user.firstname,
          user.lastname,
          user.email,
          user.birthday,
          user.user_id,
        ]);

        return res.send({
          notification: {
            message: `Profile updated!`,
            style: { color: "green" },
            success: true,
          },
        });
      } else {
        return res.send({
          notification: {
            message: `Something shitty happened`,
            style: { color: "red" },
            success: false,
          },
        });
      }
    } catch (error: unknown) {
      console.log("Error updating profile", error);
      return res.send({
        notification: {
          message: `Something shitty happened`,
          style: { color: "red" },
          success: false,
        },
      });
    }
  }
});

export { usersRouter };
