import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import axios from "./api/axiosConfig";

function App() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Members Only</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">
            <span className="icon">🏠</span> Home
          </Link>
          {currentUser && (
            <Link to="/create-message" className="nav-link">
              <span className="icon">✍️</span> Create Message
            </Link>
          )}
          {currentUser && !currentUser.membership && (
            <Link to="/join" className="nav-link">
              <span className="icon">🗝️</span> Join Club
            </Link>
          )}
        </nav>
        <div className="sidebar-footer">
          {currentUser ? (
            <div className="user-profile">
              <p>Welcome, {currentUser.firstName}</p>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <p className="register-text">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </>
          )}
          <p className="copyright">Copyright © 2026 Members-Only</p>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
