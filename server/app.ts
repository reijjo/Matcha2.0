import express from "express";
import cors from "cors";
import { connectDB } from "./utils/dbConnection";
import { verifyToken } from "./routes/loggedIn";
import { usersRouter } from "./routes/users";
import { loginRouter } from "./routes/login";
import { loggedRouter } from "./routes/loggedIn";
import { imageRouter } from "./routes/images";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use("/api/logged", verifyToken, loggedRouter);
app.use("/api/images", imageRouter);

connectDB();

export { app };
