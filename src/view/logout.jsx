import { logout } from "../redux/actions/authActions";
import { useAuth } from "../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";

export default function Logout({ action }) {
    const { dispatch } = useAuth();    
    const navigate = useNavigate(); // Get navigate function

    // Renamed function to avoid naming conflict
    const handleLogout = () => {
        try {
            logout()(dispatch);  // Dispatch the logout action
            action();            // Call the action prop (for any additional logic you want)
            navigate('/login');       // Use navigate to redirect the user to the home page or any other page
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="logout">
            <h1>Logout</h1>
            <p>Are you sure you want to logout?</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
