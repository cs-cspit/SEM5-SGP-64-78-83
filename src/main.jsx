// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Make sure Link is imported for the 404 page
import { BrowserRouter } from 'react-router-dom';
// Tailwind CSS
import './index.css'; // Make sure you import Tailwind here

// Mount App to DOM root
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <App />
  </BrowserRouter>
   
);
