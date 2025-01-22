import React from 'react';
import './Inbox.css';  // Import the custom CSS for styling
import { MSG } from '../model/MessageDUMP';

const Inbox = ({ onMessageSelect }) => {
    

    return (
        <div className="inbox-container">
            <h2>Inbox</h2>
            <ul className="message-list">
                {MSG.map((message) => (
                    <li 
                        key={message.id} 
                        className={`message-item ${!message.isRead ? 'unread' : ''}`}
                        onClick={() => onMessageSelect(message)}
                    >
                        <img className="profile-img" src={message.profileImg} alt={message.sender} />
                        <div className="message-details">
                            <h4 className="sender-name">{message.sender}</h4>
                            <p className="message-preview">{message.message.slice(0, 30)}...</p>
                            <small className="message-date">{message.date}</small>
                        </div>
                        {!message.isRead && <span className="unread-badge">New</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inbox;
