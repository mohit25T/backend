import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import http from "http";
import { initSocket } from "./src/config/socket.js";

connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(process.env.PORT, "0.0.0.0", () =>
  console.log(`Server running on ${process.env.PORT}`)
);

