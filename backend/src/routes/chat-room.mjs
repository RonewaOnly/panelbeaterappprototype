import { Router } from "express";
import jwt from "jsonwebtoken";
import OracleDB from 'oracledb';
import { v4 as uuidv4 } from 'uuid';
import { initialize,close } from "../dbConfig.mjs";

const router = Router();

// Helper function to get database connection
async function getConnection() {
  try {
    return await OracleDB.getConnection();
  } catch (err) {
    console.error('Error getting database connection:', err);
    throw err;
  }
}

// Helper function to format date for Oracle
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Helper function to format timestamp
function formatTimestamp(date) {
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

const ChatSpace = (io) => {
  // Middleware for JWT authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      socket.user = user;
      next();
    } catch (error) {
      const errorMessage = error.name === "TokenExpiredError" 
        ? "Token expired" 
        : "Invalid token";
      return next(new Error(`Authentication error: ${errorMessage}`));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Handle sending messages
    socket.on("send_message", async (data) => {
      try {
        const connection = await getConnection();
        const now = new Date();
        const messageId = uuidv4();

        // Insert new message
        const result = await connection.execute(
          `INSERT INTO message (
            message_id, sender, receiver, message, date_sent, 
            time_stamp, isRead, isReply, profileImg
          ) VALUES (
            :messageId, :sender, :receiver, :message, :dateSent,
            :timeStamp, :isRead, :isReply, :profileImg
          )`,

          {
            messageId,
            sender: socket.user.id,
            receiver: data.receiver,
            message: data.message,
            dateSent: formatDate(now),
            timeStamp: formatTimestamp(now),
            isRead: 0,
            isReply: data.isReply || 0,
            profileImg: socket.user.profileImg || null
          }
        );
        try {
          if(!result){
            throw new Error('Error inserting new message');
          }          
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit("error", { message: "Failed to send message" });
          
        }
        await connection.commit();

        // Emit message to appropriate room
        const roomId = [socket.user.id, data.receiver].sort().join('-');
        io.to(roomId).emit("receive_message", {
          messageId,
          sender: socket.user.id,
          message: data.message,
          timestamp: now,
          isRead: false,
          isReply: data.isReply || false,
          profileImg: socket.user.profileImg
        });

        await connection.close();
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle message replies
    socket.on("reply_message", async (data) => {
      try {
        const connection = await getConnection();
        const now = new Date();
        const replyId = uuidv4();

        // Insert reply
        await connection.execute(
          `INSERT INTO replies (
            replies_id, message_id, sender, receiver, 
            message, date_sent, time_stamp
          ) VALUES (
            :replyId, :messageId, :sender, :receiver,
            :message, :dateSent, :timeStamp
          )`,
          {
            replyId,
            messageId: data.messageId,
            sender: socket.user.id,
            receiver: data.receiver,
            message: data.message,
            dateSent: formatDate(now),
            timeStamp: formatTimestamp(now)
          }
        );

        await connection.commit();

        // Emit reply to room
        const roomId = [socket.user.id, data.receiver].sort().join('-');
        io.to(roomId).emit("receive_reply", {
          replyId,
          messageId: data.messageId,
          sender: socket.user.id,
          message: data.message,
          timestamp: now
        });

        await connection.close();
      } catch (error) {
        console.error('Error sending reply:', error);
        socket.emit("error", { message: "Failed to send reply" });
      }
    });

    // Handle fetching chat history
    socket.on("fetch_chat_history", async (data) => {
      try {
        const connection = await getConnection();
        
        // Fetch messages
        const messages = await connection.execute(
          `SELECT m.*, r.replies_id, r.message as reply_message, 
           r.date_sent as reply_date, r.time_stamp as reply_time
           FROM message m
           LEFT JOIN replies r ON m.message_id = r.message_id
           WHERE (m.sender = :userId AND m.receiver = :otherId)
           OR (m.sender = :otherId AND m.receiver = :userId)
           ORDER BY m.date_sent, m.time_stamp`,
          {
            userId: socket.user.id,
            otherId: data.otherId
          }
        );

        // Process and structure the messages with their replies
        const processedMessages = messages.rows.reduce((acc, row) => {
          const message = {
            messageId: row[0],
            sender: row[1],
            receiver: row[2],
            message: row[3],
            dateSent: row[4],
            timeStamp: row[5],
            isRead: Boolean(row[6]),
            isReply: Boolean(row[7]),
            profileImg: row[8]
          };

          if (row[9]) { // If there's a reply
            message.reply = {
              replyId: row[9],
              message: row[10],
              dateSent: row[11],
              timeStamp: row[12]
            };
          }

          acc.push(message);
          return acc;
        }, []);

        socket.emit("chat_history", processedMessages);
        await connection.close();
      } catch (error) {
        console.error('Error fetching chat history:', error);
        socket.emit("error", { message: "Failed to fetch chat history" });
      }
    });

    // Handle marking messages as read
    socket.on("mark_as_read", async (data) => {
      try {
        const connection = await getConnection();
        
        await connection.execute(
          `UPDATE message SET isRead = 1 
           WHERE message_id = :messageId AND receiver = :userId`,
          {
            messageId: data.messageId,
            userId: socket.user.id
          }
        );

        await connection.commit();
        await connection.close();

        // Notify sender that message was read
        io.to(data.sender).emit("message_read", {
          messageId: data.messageId
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
        socket.emit("error", { message: "Failed to mark message as read" });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  // Health check route
  router.get("/", async (req, res) => {
    try {
      const connection = await getConnection();
      await connection.close();
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