import { useState } from 'react';
import './style.css';
import { USERS } from '../model/user';
import { Link } from 'react-router-dom';

export default function Login({ action }) {
    console.log("Login page action:", action);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!username || !password) {
            setError('Username/Email and Password are required.');
            return;
        }

        // Assuming USERS[0] represents the current user for demo purposes
        USERS[0].online = true;
        action()
    };

    return (
        <div className="container">
            <form>
                <label>
                    Enter username/email:
                    <input
                        type="text"
                        id="value"
                        name="value"
                        placeholder="Enter username/email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />

                <label>
                    Enter password:
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter password e.g. 12345"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />

                {error && <p className="error-message">{error}</p>}

                <button
                    type="button"
                    className="btn"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </form>
            <hr />
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}
