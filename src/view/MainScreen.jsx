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
import { useAuth } from '../redux/reducers/authReducer';

export default function MainScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [closeMessageInbox, setCloseMessageInbox] = useState(false);
    const { state } = useAuth();



    useEffect(() => {
        // Check local storage for token and set authentication state
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }

    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        //check for the state of the user
        if (!state.user) {
            console.log('User not logged in')
        }
        console.log('User logged in ID->', state.user.session.user.id);
    };

    const handleLogout = () => {
        //localStorage.removeItem('token'); // Clear token on logout
        setIsAuthenticated(false);
    };

    const handleSelectMessage = (message) => {
        const msg = { ...message, roomId: `${state.user.session.user.id}-${message.id}` };
        setSelectedMessage(msg);
        console.log("messages:",message);
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
