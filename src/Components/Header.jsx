import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/auth-context.jsx';
import UserMenu from './UserMenu';
import './header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 1;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const renderAuthButton = () => {
    console.log('Rendering auth button, user:', user);
    if (user && user.name) {
      return <UserMenu />;
    }
    return (
      <Link
        to="/login"
        className={location.pathname === '/login' ? 'active' : ''}
        onClick={closeMenu}
      >
        Login
      </Link>
    );
  };

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="logo-container">
        <img src="/Images/logo_1.png" alt="JJE Logo" className="company-logo" />
        <h1>Jay Jalaram Electricals</h1>
      </div>

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
          to="/works"
          className={location.pathname === '/works' ? 'active' : ''}
          onClick={closeMenu}
        >
          Works
        </Link>
        <Link
          to="/about"
          className={location.pathname === '/about' ? 'active' : ''}
          onClick={closeMenu}
        >
          About
        </Link>
        {renderAuthButton()}
      </nav>
    </header>
  );
};

export default Header;