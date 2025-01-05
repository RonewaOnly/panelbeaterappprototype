import { useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { login } from '../redux/actions/authActions';
import { useAuth } from '../redux/reducers/authReducer';

export default function Login({ action }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { state, dispatch } = useAuth(); // Access auth state and dispatch from context

    const handleLogin =  () => {
        if (!username || !password) {
            setError('Username/Email and Password are required.');
            return;
        }
        //console.log('function to handle the server login: '+login(username, password)(dispatch))
        try {
            // Dispatch the login action
            login(username, password)(dispatch)
            // Check for authentication status
            if (state.isAuthenticated) {
                console.log('Logged in:', state.isAuthenticated);
                action(); // Call the action prop
                console.log('funtion',action());
            } else if (state.error) {
                setError(state.error.message || 'Login failed. Please try again.');
                console.log('Error:', state.error.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again later.');
        }
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
