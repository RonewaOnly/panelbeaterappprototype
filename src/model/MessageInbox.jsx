import React, { useState, useEffect } from "react";
import "./MessageInbox.css";
import socket from "../socket";

const MessageInbox = ({ selectedMessage, onClose }) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    if (!selectedMessage) return;

    const { roomId } = selectedMessage;

    // Fetch chat history
    socket.emit("fetch_chat_history", roomId);

    // Define handlers
    const handleChatHistory = (history) => setReplies(history || []);
    const handleReceiveMessage = (message) => {
      if (message.roomId === roomId) {
        setReplies((prevReplies) => [...prevReplies, message]);
      }
    };

    // Attach listeners
    socket.on("chat_history", handleChatHistory);
    socket.on("receive_message", handleReceiveMessage);

    // Cleanup previous listeners before adding new ones
    return () => {
      socket.off("chat_history", handleChatHistory);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedMessage]);


  const handleSendReply = () => {
    if (!newReply.trim()) return;

    const messageObj = {
      room_id: selectedMessage.roomId,
      message: newReply,
      sender: selectedMessage.receiver,
      receiver: selectedMessage.sender,
      date_sent: new Date().toISOString().split("T")[0],
      is_read: true,
      isreply: false,
      profileImg: selectedMessage.profileImg,
    };
    socket.emit("send_message", messageObj, (response) => {
      if (response?.error) {
        console.error("Message send error:", response.error);
        return;
      }
    });
    console.log("Message sent:", replies);

    // Optimistic UI update
    setReplies((prevReplies) => {
      const updatedReplies = [
        ...prevReplies,
        {
          ...messageObj,
          sender: "You" || messageObj.sender.trim(),
          timestamp: new Date().toISOString(),
        },
      ];
      console.log("Updated Replies:", updatedReplies); 
      return updatedReplies;
    });
    
    replies.map((reply, index) => {
      console.log('index of array: ', index, ' \n the replies: ', reply);
    });
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
        {(selectedMessage.sender !== "You" || selectedMessage.sender !== selectedMessage.receiver) && (
          <div className="message original-message">
            <p>{selectedMessage.message}</p>
            <small>{selectedMessage.timestamp}</small>
          </div>
        )}


        {replies.map((reply, index) => (
          <div
            key={index}
            className={`message ${(reply.sender === "You" || reply.sender === selectedMessage.receiver)
                ? "sent-message"
                : "reply-message"
              }`}
          >
            <p>{reply[3]}</p> {/* Ensure reply.message is used instead of reply[3] */}
            <small>{new Date(reply[4]).toLocaleString()}</small> {/* Ensure reply.timestamp is used */}
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
