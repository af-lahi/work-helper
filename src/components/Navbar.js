import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="nav-brand">
          DevTools
        </Link>
        {location.pathname !== '/' && (
          <Link to="/" className="back-button">
            ← Back to Tools
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
