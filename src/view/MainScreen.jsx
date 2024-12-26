import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './homepage';
import NavBar from '../model/navbar';
import './style.css';
import Login from './login';
import Profile from './profile';
import Inbox from './Inbox';
import Customers from './customers';
import Report from './reports';
import Logout from './logout';
import { useState } from 'react';
import Registartion from './registartion';


export default function MainScreen() {
    const [action, setAction] = useState(false);

    function handleIn() {
        setAction(true)
    }
    return (
        <div className='frame'>
            <Router >
                <NavBar action={action} />
                {
                    action ?
                        <Routes>
                            <Route path="/" element={<Homepage />} />
                            {
                                action ? <Route path="/logout" element={<Logout action={action} />} /> :
                                    <Route path="/login" element={<Login action={handleIn} />} />
                            }
                            <Route path='/customers' element={<Customers />} />
                            <Route path='/inbox' element={<Inbox />} />
                            <Route path='/report' element={<Report />} />
                            <Route path='/profile' element={<Profile />} />
                        </Routes>
                        : <Routes>
                            <Route path="/login" element={<Login action={handleIn} />} />
                            <Route path='/signup' element={<Registartion />} />
                        </Routes>


                }

            </Router>
        </div>
    )
}