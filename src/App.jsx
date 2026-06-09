import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Droplet, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import logo from './assets/logo.png';
import LandingPage from './features/public/pages/LandingPage';
import About from './features/public/pages/About';
import Contact from './features/public/pages/Contact';
import Join from './features/public/pages/Join';
import LoginPage from './features/auth/pages/LoginPage';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AdminRequests from './features/admin/pages/AdminRequests';
import BloodBankManagement from './features/admin/pages/BloodBankManagement';
import HospitalManagement from './features/admin/pages/HospitalManagement';
import UserManagement from './features/admin/pages/UserManagement';
import InternalBloodTypes from './features/admin/pages/InternalBloodTypes';
import RevenueInsights from './features/shared/pages/RevenueInsights';
import DashboardLayout from './shared/components/AdminLayout';
import BloodBankDashboard from './features/bloodbank/pages/BloodBankDashboard';
import HospitalDashboard from './features/hospital/pages/HospitalDashboard';
import HospitalMarketplace from './features/hospital/pages/HospitalMarketplace';
import HospitalUserManagement from './features/hospital/pages/HospitalUserManagement';
import HospitalTransactions from './features/hospital/pages/HospitalTransactions';
import Marketplace from './features/user/pages/Marketplace';
import SetupPasswordPage from './features/auth/pages/SetupPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import VerifyAccountPage from './features/auth/pages/VerifyAccountPage';
import BloodBankInventory from './features/bloodbank/pages/BloodBankInventory';
import BloodBankStaff from './features/bloodbank/pages/BloodBankStaff';
import BloodBankPOS from './features/bloodbank/pages/BloodBankPOS';
import BloodBankOrders from './features/bloodbank/pages/BloodBankOrders';
import BloodBankPricing from './features/bloodbank/pages/BloodBankPricing';
import BloodBankPayouts from './features/bloodbank/pages/BloodBankPayouts';
import BloodBankBankDetails from './features/bloodbank/pages/BloodBankBankDetails';
import AdminPayouts from './features/admin/pages/AdminPayouts';
import AdminBankDetails from './features/admin/pages/AdminBankDetails';
import GlobalConfig from './features/admin/pages/GlobalConfig';
import ProfileSettings from './features/shared/pages/ProfileSettings';
import EnquiryManagement from './features/admin/pages/EnquiryManagement';

const AppLayout = ({ children, theme, toggleTheme, isPublic = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = isPublic ? [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ] : [
    { name: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'bg-nav-bg backdrop-blur-xl border-b border-glass-border py-4 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/10 group-hover:bg-primary/15 transition-all">
              <img src={logo} alt="SwiftAid" className="h-8 w-auto" />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-glass-border mx-2" />
            
            <button 
              onClick={toggleTheme} 
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-glass rounded-lg transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isPublic ? (
              <Link 
                to="/login" 
                className="btn btn-primary px-5 py-2.5"
              >
                Login
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button 
                onClick={() => { localStorage.clear(); window.location.href='/login'; }}
                className="btn btn-outline px-5 py-2.5"
              >
                Logout
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-glass rounded-lg transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-primary hover:bg-glass rounded-lg transition-all"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-nav-bg border-b border-glass-border overflow-hidden"
            >
              <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-base font-medium transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-text-secondary'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-[1px] w-full bg-glass-border my-2" />
                {isPublic ? (
                  <Link 
                    to="/login" 
                    className="btn btn-primary w-full py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <button 
                    onClick={() => { localStorage.clear(); window.location.href='/login'; }}
                    className="btn btn-outline w-full py-3"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      {isPublic && (
        <footer className="bg-bg-darker border-t border-glass-border py-12">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg border border-primary/10">
                  <img src={logo} alt="SwiftAid" className="h-7 w-auto" />
                </div>
              </div>
              <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
                Empowering the Nigerian healthcare system through rapid, verified, and intelligent blood coordination. Every second counts, every life matters.
              </p>
            </div>
            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Network</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><Link to="/join" className="hover:text-primary transition-colors">Enquiry for Hospital</Link></li>
                <li><Link to="/join" className="hover:text-primary transition-colors">Enquiry for Blood Bank</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-6 mt-10 pt-6 border-t border-glass-border/30">
            <p className="text-xs text-text-muted">© 2026 SwiftAid Infrastructure. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-card-bg)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error)',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme} isPublic={true}><LandingPage /></AppLayout>
        } />
        <Route path="/about" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme} isPublic={true}><About /></AppLayout>
        } />
        <Route path="/contact" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme} isPublic={true}><Contact /></AppLayout>
        } />
        <Route path="/join" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme} isPublic={true}><Join /></AppLayout>
        } />
        <Route path="/login" element={<LoginPage theme={theme} />} />
        <Route path="/setup-password" element={<SetupPasswordPage theme={theme} />} />
        <Route path="/reset-password" element={<ResetPasswordPage theme={theme} />} />
        <Route path="/verify" element={<VerifyAccountPage theme={theme} />} />
        <Route path="/admin/*" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="blood-banks" element={<BloodBankManagement />} />
              <Route path="hospitals" element={<HospitalManagement />} />
              <Route path="enquiries" element={<EnquiryManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="blood-types" element={<InternalBloodTypes />} />
              <Route path="config" element={<GlobalConfig />} />
              <Route path="payouts" element={<AdminPayouts />} />
              <Route path="payouts/banks" element={<AdminBankDetails />} />
              <Route path="revenue" element={<RevenueInsights isAdmin={true} />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Routes>
          </DashboardLayout>
        } />
        <Route path="/bloodbank/*" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
            <Routes>
              <Route path="/" element={<BloodBankDashboard />} />
              <Route path="inventory" element={<BloodBankInventory />} />
              <Route path="staff" element={<BloodBankStaff />} />
              <Route path="pos" element={<BloodBankPOS />} />
              <Route path="orders" element={<BloodBankOrders />} />
              <Route path="pricing" element={<BloodBankPricing />} />
              <Route path="payouts" element={<BloodBankPayouts />} />
              <Route path="payouts/banks" element={<BloodBankBankDetails />} />
              <Route path="revenue" element={<RevenueInsights isAdmin={false} />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Routes>
          </DashboardLayout>
        } />
        <Route path="/marketplace" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme}><Marketplace /></AppLayout>
        } />
        <Route path="/hospital/*" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
             <Routes>
              <Route path="/" element={<HospitalDashboard />} />
              <Route path="marketplace" element={<HospitalMarketplace />} />
              <Route path="users" element={<HospitalUserManagement />} />
              <Route path="transactions" element={<HospitalTransactions />} />
              <Route path="settings" element={<ProfileSettings />} />
             </Routes>
          </DashboardLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
