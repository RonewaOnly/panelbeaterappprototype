import { io } from "socket.io-client";
import { refreshToken } from "./redux/actions/authActions";

const socket = io("http://localhost:3000", {
  auth: {
    token: localStorage.getItem("accessToken"),
    refreshToken: refreshToken(),
  },
  withCredentials: true,
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

export default socket;
