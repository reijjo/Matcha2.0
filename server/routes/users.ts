import express, { Request, Response } from "express";
import { pool } from "../utils/dbConnection";
import { Profile, User } from "../utils/types";
import { config } from "../utils/config";
import bcrypt from "bcryptjs";
import { scryptSync, randomBytes } from "crypto";
import nodemailer from "nodemailer";
import checks from "../utils/differentChecks";

const usersRouter = express.Router();

// const isEmpty = (obj: object): boolean => {
// 	return Object.keys(obj).length === 0;
// }

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
    res.send({ notification: emailNotif });
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
    return res.send({ message: "huhuh" });
  }
});

export { usersRouter };
