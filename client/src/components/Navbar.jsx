import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Quiz App
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <span className="nav-user">
                {user?.name} ({user?.role})
              </span>

              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>

              
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link">
                  Admin Panel
                </Link>
              )}

              <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="btn btn-sm btn-primary">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
