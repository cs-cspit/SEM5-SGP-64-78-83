import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/auth-context.jsx';
import UserMenu from './UserMenu';
import './header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setIsScrolled(scrollTop > 10);
      setScrollProgress(scrollPercent);
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

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderAuthButton = () => {
    console.log('Rendering auth button, user:', user);
    if (user && user.name) {
      return <UserMenu />;
    }
    return (
      <Link
        to="/login"
        className={`login-btn ${location.pathname === '/login' ? 'active' : ''}`}
        onClick={closeMenu}
      >
        <i className="fas fa-sign-in-alt"></i>
        <span>Login</span>
      </Link>
    );
  };

  return (
    <>
      <header className={isScrolled ? 'scrolled' : ''}>
        {/* Scroll Progress Indicator */}
        <div 
          className="scroll-progress" 
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin="0"
          aria-valuemax="100"
        />

        <div className="header-container">
          <div className="logo-container">
            <img src="/Images/logo_1.png" alt="Jay Jalaram Electricals Logo" className="company-logo" />
            <h1>Jay Jalaram Electricals</h1>
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu} 
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger"></span>
          </button>

          {/* Navigation Links */}
          <nav className={isMenuOpen ? 'open' : ''} role="navigation">
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
              onClick={closeMenu}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
            <Link
              to="/works"
              className={location.pathname === '/works' ? 'active' : ''}
              onClick={closeMenu}
              aria-current={location.pathname === '/works' ? 'page' : undefined}
            >
              <i className="fas fa-briefcase"></i>
              <span>Works</span>
            </Link>
            <Link
              to="/about"
              className={location.pathname === '/about' ? 'active' : ''}
              onClick={closeMenu}
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              <i className="fas fa-info-circle"></i>
              <span>About</span>
            </Link>
            <Link
              to="/contact"
              className={location.pathname === '/contact' ? 'active' : ''}
              onClick={closeMenu}
              aria-current={location.pathname === '/contact' ? 'page' : undefined}
            >
              <i className="fas fa-envelope"></i>
              <span>Contact</span>
            </Link>
            {renderAuthButton()}
          </nav>
        </div>
      </header>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${isScrolled ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
};

export default Header;