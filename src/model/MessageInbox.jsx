// File: /src/MessageInbox.jsx
import React, { useState } from 'react';
import './MessageInbox.css'; // Import custom CSS for styling
import { MSG } from './MessageDUMP';

const MessageInbox = ({ selectedMessage, onClose }) => {
    const [replies, setReplies] = useState(selectedMessage.replies || []);
    const [newReply, setNewReply] = useState("");

    const handleClose = () => {
        if (onClose) {
            onClose(); // Call the provided onClose function
        }
    };

    const handleSendReply = () => {
        if (!newReply.trim()) return;

        const updatedReplies = [
            ...replies,
            {
                sender: selectedMessage.receiver,
                receiver: selectedMessage.sender,
                message: newReply,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            },
        ];
        setReplies(updatedReplies);
        setNewReply("");

        const messageIndex = MSG.findIndex(msg => msg.id === selectedMessage.id);
        if (messageIndex !== -1) {
            MSG[messageIndex].replies = updatedReplies;
            MSG[messageIndex].isReply = true;
        }
    };

    return (
        <div className="message-inbox-container">
            <button className="close-btn" onClick={handleClose}>Close</button>
            <header className="chat-header">
                <img src={selectedMessage.profileImg} alt={selectedMessage.sender} className="chat-profile-img" />
                <h2>{selectedMessage.sender}</h2>
            </header>
            <div className="messages">
                <div className="message original-message">
                    <p>{selectedMessage.message}</p>
                    <small>{selectedMessage.date} {selectedMessage.time}</small>
                </div>
                {replies.map((reply, index) => (
                    <div className="message reply-message" key={index}>
                        <p>{reply.message}</p>
                        <small>{reply.date} {reply.time}</small>
                    </div>
                ))}
            </div>
            <div className="new-reply-container">
                <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Type your reply..."
                    style={newReply.trim() === "" ? { border: "1px solid red" } : {}}
                />
                <button onClick={handleSendReply} disabled={newReply.trim() === ""}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessageInbox;
