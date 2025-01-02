import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './homepage';
import NavBar from '../model/navbar';
import './style.css';
import Login from './login';
import Profile from './profile';
import Inbox from './Inbox';
import InvoiceForm from './Invoice';
import Customers from './customers';
import Report from './reports';
import Logout from './logout';
import { useState } from 'react';
import Registartion from './registartion';
import MessageInbox from '../model/MessageInbox';

export default function MainScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [closeMessageInbox, setCloseMessageInbox] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
    };

    const handleCloseMessageInbox = () => {
        setCloseMessageInbox(true);
        setSelectedMessage(null);
    };

    return (
        <div className="frame">
            <Router>
                <NavBar action={isAuthenticated} />
                <Routes>
                    {isAuthenticated ? (
                        <>
                            <Route path="/" element={<Homepage />} />
                            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route
                                path="/inbox"
                                element={
                                    !selectedMessage ? (
                                        <Inbox onMessageSelect={handleSelectMessage} />
                                    ) : (
                                        <MessageInbox
                                            selectedMessage={selectedMessage}
                                            onClose={handleCloseMessageInbox}
                                            close={closeMessageInbox}
                                        />
                                    )
                                }
                            />
                            <Route path="/report" element={<Report />} />
                            <Route path="/invoice" element={<InvoiceForm />} />
                            <Route path="/profile" element={<Profile />} />
                        </>
                    ) : (
                        <>
                            <Route path="/login" element={<Login action={handleLogin} />} />
                            <Route path="/signup" element={<Registartion />} />
                        </>
                    )}
                </Routes>
            </Router>
        </div>
    );
}
