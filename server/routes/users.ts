import express, { Request, Response } from "express";
import { pool } from "../utils/dbConnection";
import { User } from "../utils/types";
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
  if (user) {
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
					<a href="http://localhost:3000/verify/${codeHash}"> HERE </a><br />
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
            0,
          ]);
          sendVerifyCode();
          // (err: unknown, result: Response) => {
          //   if (err) {
          //     console.log("ERROR Inserting user to database: ", err);
          //   } else {
          //     sendVerifyCode();
          //     res.send({
          //       notification: {
          //         message: `Registration email sent to '${user.email}'`,
          //         style: { color: "green" },
          //         success: true,
          //       },
          //       result,
          //     });
          //   }
          // };
        }
      } catch (error: unknown) {
        console.log("ERROR on duplicate check: ", error);
      }

      console.log("lahtaa maili");
    }
  }
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

export { usersRouter };
