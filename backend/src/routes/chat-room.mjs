import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// Mock databases for users, chat rooms, and message history
let users = {};
let chatRooms = {}; // Stores chat rooms: { businessId: { customerId: roomId } }
let messageHistory = {}; // Stores message history: { roomId: [messages] }

const ChatSpace = (io) => {
  // Middleware for JWT authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token; // Retrieve token from client
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET || "default_secret"); // Verify token
      socket.user = user; // Attach decoded user to socket
      next(); // Continue to next middleware
    } catch (error) {
      const errorMessage =
        error.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token";
      return next(new Error(`Authentication error: ${errorMessage}`));
    }
  });

  // Handle connection
  io.on("connection" ,(socket) => {
    console.log("Client connected");
    //how to view the an [object object] in the console
    console.log(socket.user);
    console.log(`Connected: ${socket.user}`); // Log connected user's ID

    // Helper function for validation
    const isValidMessageData = (data) =>
      data?.roomId &&
      typeof data.roomId === "string" &&
      typeof data.message === "string";

    // Handle 'send_message' event
    socket.on("send_message", (data) => {
      if (!isValidMessageData(data)) {
        return socket.emit("error", { message: "Invalid message data." });
      }

      const { roomId, message } = data;

      // Validate room membership
      if (!chatRooms[socket.user.id]?.[roomId]) {
        return socket.emit("error", { message: "You are not in this chat room." });
      }

      const messageObj = {
        user: socket.user,
        message,
        timestamp: new Date(),
      };

      // Save message to history
      messageHistory[roomId] = messageHistory[roomId] || [];
      messageHistory[roomId].push(messageObj);

      // Emit message to the room
      io.to(roomId).emit("receive_message", messageObj);
    });

    // Handle 'create_chat_room' event
    socket.on("create_chat_room", (data) => {
      const { customerId, businessId } = data;
      if (!customerId || !businessId) {
        return socket.emit("error", { message: "Invalid chat room data." });
      }

      const roomId = `${businessId}-${customerId}`;

      // Create or join room
      chatRooms[businessId] = chatRooms[businessId] || {};
      chatRooms[businessId][customerId] = roomId;

      socket.join(roomId);

      // Notify participants
      socket.emit("chat_room_created", { roomId });
      console.log(`Chat room created between ${businessId} and ${customerId}`);
    });

    // Handle 'fetch_chat_history' event
    socket.on("fetch_chat_history", (roomId) => {
      if (!roomId || typeof roomId !== "string") {
        return socket.emit("error", { message: "Invalid room ID." });
      }

      const history = messageHistory[roomId] || [];
      socket.emit("chat_history", history);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.user.id}`);

      // Cleanup chatRooms and other related data
      for (const [businessId, rooms] of Object.entries(chatRooms)) {
        for (const [customerId, roomId] of Object.entries(rooms)) {
          if (socket.rooms.has(roomId)) {
            delete chatRooms[businessId][customerId];
          }
        }
      }
    });
  });

  // Route for initializing the chat
  router.get("/", (req, res) => {
    res.json({ message: "Chat service is running.", users, chatRooms });
  });

  return router; // Return the router
};

export default ChatSpace;
