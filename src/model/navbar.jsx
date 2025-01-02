import { Link } from "react-router-dom";
import '../view/style.css';


export default function NavBar({action}){
    console.log("NavBar action:", action);
    return(
        <nav >
            <div className="profile-container">
                <Link to="/profile"><i className="fa-solid fa-user"></i></Link>
            </div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/customers">Customers</Link></li>
                <li><Link to="/inbox">Message</Link></li>
                <li><Link to="/report">Reports</Link></li>
                <li><Link to="/invoice">Invoice</Link></li>
                <hr/>
                <li>
                    {
                        action ?
                        <Link to="/logout">Logout</Link>:<Link to="/login">Login</Link>
                    }
                </li>
                
            </ul>
        </nav>
    );
}