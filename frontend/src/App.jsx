import { Link, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>MICHANOKU CLUBHOUSE</h1>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">
            <span className="icon">🏠</span> Home
          </Link>
          
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
              <button className="btn-logout">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <p className="register-text">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </>
          )}
          <p className="copyright">Copyright © 2026 Michanoku</p>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
