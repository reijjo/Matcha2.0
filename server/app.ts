import express from "express";
import cors from "cors";
import { createServer } from "http";
import { connectDB } from "./utils/dbConnection";
import { verifyToken } from "./routes/loggedIn";
import { usersRouter } from "./routes/users";
import { loginRouter } from "./routes/login";
import { loggedRouter } from "./routes/loggedIn";
import { imageRouter } from "./routes/images";
import path from "path";
import { profileRouter } from "./routes/profiles";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const uploadsDir = path.join(__dirname, "uploads");
app.use("/app/uploads", express.static(uploadsDir));

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use("/api/logged", verifyToken, loggedRouter);
app.use("/api/images", imageRouter);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use("/api/profiles", profileRouter);

connectDB();

export { app, server };
