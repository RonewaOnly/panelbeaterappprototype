import React, { useState, useEffect } from "react";
import "./MessageInbox.css";
import socket from "../socket";

const MessageInbox = ({ selectedMessage, onClose }) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    if (selectedMessage) {
      const { roomId } = selectedMessage;

      // Fetch chat history
      socket.emit("fetch_chat_history", roomId);

      // Listen for chat history and new messages
      socket.on("chat_history", (history) => setReplies(history || []));
      socket.on("receive_message", (message) => {
        if (message.roomId === roomId) {
          setReplies((prevReplies) => [...prevReplies, message]);
        }
      });

      // Cleanup listeners
      return () => {
        socket.off("chat_history");
        socket.off("receive_message");
      };
    }
  }, [selectedMessage]);

  const handleSendReply = () => {
    if (!newReply.trim()) return;

    const messageObj = {
      roomId: selectedMessage.roomId,
      message: newReply,
    };
    socket.emit("send_message", messageObj, (response) => {
      if (response?.error) {
        console.error("Message send error:", response.error);
        return;
      }
    });

    // Optimistic UI update
    setReplies((prevReplies) => [
      ...prevReplies,
      {
        ...messageObj,
        sender: "You",
        timestamp: new Date().toISOString(),
      },
    ]);
    setNewReply("");
  };

  if (!selectedMessage) {
    return (
      <div className="message-inbox-placeholder">
        <p>No message selected. Please select a conversation to view messages.</p>
      </div>
    );
  }

  return (
    <div className="message-inbox-container">
      <button className="close-btn" onClick={onClose}>
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
        {/* Render the sender's initial message */}
        {selectedMessage.sender !== "You" && (
          <div className="message original-message">
            <p>{selectedMessage.message}</p>
            <small>{selectedMessage.timestamp}</small>
          </div>
        )}

        {replies.map((reply, index) => (
          <div
            key={index}
            className={`message ${
              reply.sender === "You" ? "sent-message" : "reply-message"
            }`}
          >
            <p>{reply.message}</p>
            <small>{new Date(reply.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="new-reply-container">
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Type your reply..."
        />
        <button onClick={handleSendReply} disabled={!newReply.trim()} aria-label="Send reply">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInbox;
