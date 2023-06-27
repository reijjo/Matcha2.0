import express from "express";
import cors from "cors";
import { connectDB } from "./utils/dbConnection";
import { usersRouter } from "./routes/users";
import { loginRouter } from "./routes/login";
import { loggedRouter } from "./routes/loggedIn";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logged", loggedRouter);

connectDB();

export { app };
