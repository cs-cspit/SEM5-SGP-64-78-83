import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import './header.css';

const Header = () => {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <h1>Jay Jalaram Electricals</h1>

      {/* Hamburger Menu Toggle Button */}
      <button className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation menu">
        <span className="hamburger"></span>
      </button>

      {/* Navigation Links */}
      <nav className={isMenuOpen ? 'open' : ''}>
        <Link
          to="/"
          className={location.pathname === '/' ? 'active' : ''}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={location.pathname === '/about' ? 'active' : ''}
          onClick={closeMenu}
        >
          About
        </Link>
        {/* <Link
          to="/Contact"
          className={location.pathname === '/Contact' ? 'active' : ''}
          onClick={closeMenu}
        >
          Contact
        </Link> */}
        <Link
          to="/login"
          className={location.pathname === '/login' ? 'active' : ''}
          onClick={closeMenu}
        >
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;