import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import Registartion from './registartion';
import MessageInbox from '../model/MessageInbox';

export default function MainScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [closeMessageInbox, setCloseMessageInbox] = useState(false);

    useEffect(() => {
        // Check local storage for token and set authentication state
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        //localStorage.removeItem('token'); // Clear token on logout
        setIsAuthenticated(false);
    };

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
        console.log("selected message:"+message);
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
                            <Route path="/logout" element={<Logout action={handleLogout} />} />
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
                            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to home */}
                        </>
                    ) : (
                        <>
                            <Route path="/login" element={<Login action={handleLogin} />} />
                            <Route path="/signup" element={<Registartion />} />
                            <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect to login */}
                        </>
                    )}
                </Routes>
            </Router>
        </div>
    );
}
