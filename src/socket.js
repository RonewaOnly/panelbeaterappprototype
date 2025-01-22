import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: localStorage.getItem("token"), // Replace with your token retrieval logic
  },
  withCredentials: true,
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

export default socket;
