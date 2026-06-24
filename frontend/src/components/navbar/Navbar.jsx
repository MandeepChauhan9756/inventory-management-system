import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="navbar">

      <div className="navbar-left">
        <h2>📦 Inventory Manager</h2>
      </div>

      <div className="navbar-right">

        <div className="user-info">
          <span className="user-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </span>

          <div>
            <p className="username">
              {user?.username || "User"}
            </p>

            <small className="role">
              {user?.role || "Staff"}
            </small>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;