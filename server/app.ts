import express from "express";
import cors from "cors";
import { connectDB } from "./utils/dbConnection";
import { usersRouter } from "./routes/users";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", usersRouter);

connectDB();

export { app };
