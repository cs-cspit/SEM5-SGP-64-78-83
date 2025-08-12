import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth-context.jsx';
import { useAuth } from './context/auth-context.jsx';
import Header from './Components/Header';

// Page components
import Home from './Pages/Home';
import About from './Pages/about';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ContactForm from './Pages/ContactForm';
import WiringExcellencePage from './Pages/WiringExcellencePage';
import ProactiveMaintenancePage from './Pages/ProactiveMaintenancePage';
import HavellsServiceCenterPage from './Pages/HavellsServiceCenterPage';
import IndustrialSetupPage from './Pages/IndustrialSetupPage';
import AdminPanel from './Pages/Admin/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/services/wiring" element={<WiringExcellencePage />} />
          <Route path="/services/maintenance" element={<ProactiveMaintenancePage />} />
          <Route path="/services/havells" element={<HavellsServiceCenterPage />} />
          <Route path="/services/industrial" element={<IndustrialSetupPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App;
