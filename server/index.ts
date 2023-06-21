// import express from "express";
// const app = express();
// app.use(express.json());

// const PORT = 3001;

// app.listen(PORT, () => {
//   console.log(`Server on port ${PORT}`);
// });
import { app } from "./app";
import { config } from "./utils/config";

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(config.PORT, () => {
  console.log(`Server on port ${config.PORT}`);
});
