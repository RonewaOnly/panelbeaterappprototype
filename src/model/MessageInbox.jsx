import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./MessageInbox.css";

const socket = io("http://localhost:3000/chat", {
  auth: {
    token: localStorage.getItem("token"), // Token-based authentication
  },
});

const MessageInbox = ({ selectedMessage, onClose }) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    if (selectedMessage) {
      // Fetch chat history when a message is selected
      socket.emit("fetch_chat_history", selectedMessage.roomId);

      socket.on("chat_history", (history) => {
        setReplies(history);
      });

      // Listen for new messages in the room
      socket.on("receive_message", (message) => {
        if (message.roomId === selectedMessage.roomId) {
          setReplies((prevReplies) => [...prevReplies, message]);
        }
      });
    }

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, [selectedMessage]);

  const handleSendReply = () => {
    if (!newReply.trim()) return;

    const messageObj = {
      roomId: selectedMessage.roomId,
      message: newReply,
    };

    // Emit the message to the backend
    socket.emit("send_message", messageObj);

    setNewReply("");
  };

  if (!selectedMessage) {
    return <div>No message selected.</div>;
  }

  return (
    <div className="message-inbox-container">
      <button className="close-btn" onClick={onClose} aria-label="Close chat">
        Close
      </button>
      <header className="chat-header">
        <img
          src={selectedMessage.profileImg}
          alt={`${selectedMessage.sender}'s profile`}
          className="chat-profile-img"
        />
        <h2>{selectedMessage.sender}</h2>
      </header>
      <div className="messages">
        {replies.map((reply, index) => (
          <div
            key={index}
            className={`message ${reply.sender === selectedMessage.receiver ? "reply-message" : "sent-message"}`}
          >
            <p>{reply.message}</p>
            <small>
              {new Date(reply.timestamp).toLocaleDateString()}{" "}
              {new Date(reply.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <div className="new-reply-container">
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Type your reply..."
          aria-label="Type your reply"
        />
        <button onClick={handleSendReply} disabled={!newReply.trim()} aria-label="Send reply">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInbox;
