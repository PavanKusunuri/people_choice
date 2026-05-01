import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gold">CineVault</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link to="/browse" className="text-gray-300 hover:text-gold transition">
              Browse
            </Link>
            <Link to="/search" className="text-gray-300 hover:text-gold transition">
              Search
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-300 hover:text-gold transition">
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="btn-primary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
