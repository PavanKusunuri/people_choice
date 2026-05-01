import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-gold font-bold text-lg mb-4">CineVault</h3>
            <p className="text-gray-400 text-sm">
              Your premium entertainment database. Discover, rate, and review your favorite titles.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/browse" className="hover:text-gold transition">
                  Browse
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-gold transition">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-gold transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-gold transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-border pt-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} CineVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
