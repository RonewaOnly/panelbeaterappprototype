import { io } from "socket.io-client";

// Establish a connection to the backend
const socket = io("http://localhost:3000", {
    auth: {
        token: localStorage.getItem("token"), // Assuming you store JWT in localStorage
    },
    withCredentials: true,
});
// Export the socket instance for reuse
export default socket;
