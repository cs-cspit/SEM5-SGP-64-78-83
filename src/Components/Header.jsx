// src/components/Header.jsx

import React from 'react';
import './header.css'; // Import your custom CSS file
import About from '../Pages/about';
const Header = () => {
  return (
    <header>
      <h1>Jay Jalaram Electricals</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        
        <a href="/works">Works</a>
        <a href="/contact">Contact</a>
        <a href="/login">Login</a>
      </nav>
    </header>
  );
};

export default Header;
