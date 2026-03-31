import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "https://m.apexitworld.com",
        "https://apexitworld.com",
        "http://localhost:3000",
        // Added standard React Native / Flutter testing hosts if needed
        "http://localhost:8081"
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Clients can join specific rooms (e.g., 'society_123_guards', 'user_456')
    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });

    // Flutter App specific joins
    socket.on("join_society", (societyId) => {
      const room = `society_${societyId}`;
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });

    socket.on("join_user", (userId) => {
      const room = `user_${userId}`;
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });
    
    // Allow leaving a room
    socket.on("leave_room", (room) => {
      socket.leave(room);
      console.log(`Client ${socket.id} left room ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
