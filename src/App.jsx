import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth-context.jsx';
import Header from './Components/Header';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

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
import UserRoleManagement from './Pages/Admin/UserRoleManagement';

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
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/user-roles" 
            element={
              <ProtectedRoute adminOnly>
                <UserRoleManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App;
