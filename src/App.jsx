// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import shared components
import Header from './Components/Header';
// import Footer from './components/Footer';

// Import pages
import Home from './Pages/Home';
// import About from './Pages/About';
// import Works from './Pages/Works';
// import Contact from './Pages/Contact';
// import Login from './Pages/Login';
// import Register from './Pages/Register'
// // Admin Pages (Optional Lazy Loading)
// import Dashboard from './pages/Admin/Dashboard';
// import Clients from './pages/Admin/Clients';
// import Invoices from './pages/Admin/Invoices';
// import Settings from './pages/Admin/Settings';
import About from './Pages/about';

function App() {
  return (
    
   <>
     <Header/>
     <Home/>

   </>
      
    
    
      
  );
}

export default App;
