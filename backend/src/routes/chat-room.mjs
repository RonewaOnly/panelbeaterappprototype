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
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Handle connection
  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.user.id}`); // Log connected user's ID

    // Handle 'send_message' event
    socket.on("send_message", (data) => {
      const { roomId, message } = data;

      // Validate room membership
      if (chatRooms[socket.user.id]?.[roomId]) {
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
      } else {
        socket.emit("error", { message: "You are not in this chat room." });
      }
    });

    // Handle 'create_chat_room' event
    socket.on("create_chat_room", (data) => {
      const { customerId, businessId } = data;
      const roomId = `${businessId}-${customerId}`;

      // Create or join room
      chatRooms[businessId] = chatRooms[businessId] || {};
      chatRooms[businessId][customerId] = roomId;

      socket.join(roomId);

      // Notify participants
      io.to(businessId).emit("chat_room_created", { roomId });
      io.to(customerId).emit("chat_room_created", { roomId });

      console.log(`Chat room created between ${businessId} and ${customerId}`);
    });

    // Handle 'fetch_chat_history' event
    socket.on("fetch_chat_history", (roomId) => {
      const history = messageHistory[roomId] || [];
      socket.emit("chat_history", history);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.user.id}`);
    });
  });

  // Route for initializing the chat
  router.get("/", (req, res) => {
    res.json({ message: "Chat service is running.", users, chatRooms });
  });

  return router; // Return the router
};

export default ChatSpace;
