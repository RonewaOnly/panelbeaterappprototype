import { Router } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

const liveRoomRouter = Router();

const LiveRoom = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Authentication error: Token missing"));
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
          socket.user = user;
          next();
        } catch (error) {
          return next(new Error(`Authentication error: ${error.name === "TokenExpiredError" ? "Token expired" : "Invalid token"}`))
        }
      });

      io.on('connection',(socket) => {
        console.log('a user connected');
        socket.on('job-selection',(data,status) => {
            const jobId = uuidv4();
            const jobStatus = ['accepted','rejected','pending','completed'];
            console.log(data,jobStatus);
        });




        socket.on('disconnect',() => {
            console.log('user disconnected');
        });

      });
}
