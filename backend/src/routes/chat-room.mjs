import { Router } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import Message from "../models/message.mjs";

const router = Router();

const ChatSpace = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error: Token missing"));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error(`Authentication error: ${error.name === "TokenExpiredError" ? "Token expired" : "Invalid token"}`));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("send_message", async (data) => {
      console.log("data from the frontend:", data);
      try {
        const now = new Date();
        console.log("socket.user from the backend:", socket.user.user.business_Name);

        const messageData = {
          room_id: data.room_id,
          sender: socket.user.user.business_Name,
          receiver: data.receiver,
          message: data.message,
          date_sent: now,
          time_stamp: now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          isRead: false,
          isReply: data.isreply || false,
          profileImg: socket.user.profileImg,
          replies: []
        };
        console.log("Message data from the backend:", messageData);
        await Message.create(messageData);


        const roomId = [socket.user.id, data.receiver].sort().join('-');
        io.to(roomId).emit("receive_message", messageData);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit("error", { message: "Failed to send message" });
      }
      //debug why it is not sending to the database
      console.log("Message sent to database");
    });

    socket.on("reply_message", async (data) => {
      try {
        const now = new Date();
        const replyData = {
          id: uuidv4(),
          message_id: data.messageId,
          sender: socket.user.id,
          receiver: data.receiver,
          message: data.message,
          date: now.toISOString().split('T')[0],
          time: now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        };

        const message = await Message.getById(data.messageId);
        message.replies.push(replyData);
        await Message.update(data.messageId, message);

        const roomId = [socket.user.id, data.receiver].sort().join('-');
        io.to(roomId).emit("receive_reply", replyData);
      } catch (error) {
        console.error('Error sending reply:', error);
        socket.emit("error", { message: "Failed to send reply" });
      }
    });

    socket.on("fetch_chat_history", async (data) => {
      try {
        const messages = await Message.getAll();
        const filteredMessages = messages.filter(msg => 
          (msg.sender === socket.user.id && msg.receiver === data.otherId) ||
          (msg.sender === data.otherId && msg.receiver === socket.user.id)
        );
        socket.emit("chat_history", filteredMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        socket.emit("error", { message: "Failed to fetch chat history" });
      }
    });

    socket.on("mark_as_read", async (data) => {
      try {
        const message = await Message.getById(data.messageId);
        message.isRead = true;
        await Message.update(data.messageId, message);

        io.to(data.sender).emit("message_read", {
          messageId: data.messageId
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
        socket.emit("error", { message: "Failed to mark message as read" });
      }
    });

    socket.on("delete_message", async (data) => {
      try {
        await Message.delete(data.messageId);
        const roomId = [socket.user.id, data.receiver].sort().join('-');
        io.to(roomId).emit("message_deleted", { messageId: data.messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit("error", { message: "Failed to delete message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  router.get("/", async (req, res) => {
    try {
      await Message.getAll();
      res.json({ message: "Chat service is running and database is connected." });
    } catch (error) {
      res.status(500).json({ 
        message: "Chat service is running but database connection failed.",
        error: error.message 
      });
    }
  });

  return router;
};

export default ChatSpace;