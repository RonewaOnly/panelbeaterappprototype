import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { login } from "../redux/actions/authActions";
import { useAuth } from "../redux/reducers/authReducer";
import "./style.css";

export default function Login({ action }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { state, dispatch } = useAuth(); // Access auth state and dispatch from context

    // Check authentication state change
    useEffect(() => {
        if (state.isAuthenticated) {
            action(); // Call the action prop if authenticated
        }
    }, [state.isAuthenticated, action]);

    // Update error message when state.error changes
    useEffect(() => {
        if (state.error) {
            setError(state.error.message || "Login failed. Please try again.");
        }
    }, [state.error]);

    const handleLogin = async () => {
        setError(""); // Clear previous error
        if (!username || !password) {
            setError("Username/Email and Password are required.");
            return;
        }

        setLoading(true);
        try {
            await login(username, password)(dispatch);
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={(e) => e.preventDefault()}>
                <label>
                    Enter username/email:
                    <input
                        type="text"
                        name="username"
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
                        name="password"
                        placeholder="Enter password"
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
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <hr />
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}
