import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth-context.jsx';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ScrollToTop from './Components/ScrollToTop';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, clientOnly = false }) => {
  const { user, isAdmin, isClient } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }

  if (clientOnly && !isClient()) {
    return <Navigate to="/" />;
  }

  return children;
};

// Page components
import Home from './Pages/Home';
import About from './Pages/about';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import EmailVerification from './Pages/EmailVerification';
import ResendVerification from './Pages/ResendVerification';
import Works from './Pages/Works';
import ContactForm from './Pages/ContactForm';
import WiringExcellencePage from './Pages/WiringExcellencePage';
import ProactiveMaintenancePage from './Pages/ProactiveMaintenancePage';
import HavellsServiceCenterPage from './Pages/HavellsServiceCenterPage';
import IndustrialSetupPage from './Pages/IndustrialSetupPage';
import AdminPanel from './Pages/Admin/AdminPanel';
import UserRoleManagement from './Pages/Admin/UserRoleManagement';
import BillGeneration from './Pages/Admin/BillGeneration';
import AddClient from './Pages/Admin/AddClient';
import InvoiceList from './Pages/Admin/InvoiceList';
import PaymentManagement from './Pages/Admin/PaymentManagement';
import WorkDetail from './Pages/WorkDetail';
import QuoteForm from './Pages/Admin/QuoteForm';
import Profile from './Pages/Profile';
import ClientDashboard from './Pages/ClientDashboard';
import Projects from './Pages/Company/Projects';
import Clientele from './Pages/Company/Clientele';
import Careers from './Pages/Company/Careers';
import FAQ from './Pages/Company/FAQ';
import Terms from './Pages/Company/Terms';

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:category" element={<WorkDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services/wiring" element={<WiringExcellencePage />} />
          <Route path="/services/maintenance" element={<ProactiveMaintenancePage />} />
          <Route path="/services/havells" element={<HavellsServiceCenterPage />} />
          <Route path="/services/industrial" element={<IndustrialSetupPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/clientele" element={<Clientele />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
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
          <Route
            path="/admin/bill"
            element={
              <ProtectedRoute adminOnly>
                <BillGeneration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bill/edit/:billId"
            element={
              <ProtectedRoute adminOnly>
                <BillGeneration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-client"
            element={
              <ProtectedRoute adminOnly>
                <AddClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute adminOnly>
                <InvoiceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute adminOnly>
                <PaymentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quote-form"
            element={
              <ProtectedRoute adminOnly>
                <QuoteForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute clientOnly>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  )
}

export default App;