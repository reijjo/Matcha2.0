import express from "express";
import { connectDB } from "./utils/dbConnection";

const app = express();

app.use(express.json());

connectDB();

export { app };
