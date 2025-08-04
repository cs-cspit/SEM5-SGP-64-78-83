// Root component that handles routing and layout
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header';

// Page components
import Home from './Pages/Home';
import About from './Pages/about';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ContactForm from './Components/ContactForm';
import WiringExcellencePage from './Pages/WiringExcellencePage';
import ProactiveMaintenancePage from './Pages/ProactiveMaintenancePage';
import HavellsServiceCenterPage from './Pages/HavellsServiceCenterPage';
import IndustrialSetupPage from './Pages/IndustrialSetupPage';

function App() {
  return (
    <>
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
        </Routes>
      </main>
    </>
  )
}

export default App;
