import { app, server } from "./app";
import { config } from "./utils/config";
import { Server, Socket } from "socket.io";

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

// app.listen(config.PORT, () => {
//   console.log(`Server on port ${config.PORT}`);
// });

const socketIO = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

socketIO.on("connection", (socket: Socket) => {
  console.log("SOCKET IS ON!", socket.id);

  socket.on("user_connected", async (userId) => {
    await socket.join(String(userId));
    console.log("User joined room with own ID", userId, "connected");
  });

  socketIO.on("notification", (notification: string) => {
    console.log("New Notification", notification);
  });

  socketIO.on("message", (message: string) => {
    console.log("New Message", message);
  });
});

server.listen(config.PORT, () => {
  console.log(`Server on port ${config.PORT}`);
});
