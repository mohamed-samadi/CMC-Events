import { Navigate } from "react-router-dom"
import { logout } from "../services/authService";
import "../styles/NavBar.css";
function NavBar() {
  const handleLogout = () => {
    logout();
    window.location.reload(); // Reload the page to update the state
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <ul className="nav-list">
          <li>
            <button className="nav-btn">Home</button>
          </li>
          <li>
            <button className="nav-btn">Dashboard</button>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <p className="profile">Profile</p>
        <button className="logout-btn" onClick={handleLogout}>
            <img src="./images/logout.png" alt="icons logout" className="icon-logout" />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;


