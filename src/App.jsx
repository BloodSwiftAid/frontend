import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Droplet, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import logo from './assets/logo.png';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Join from './pages/Join';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import BloodBankManagement from './pages/admin/BloodBankManagement';
import HospitalManagement from './pages/admin/HospitalManagement';
import UserManagement from './pages/admin/UserManagement';
import InternalBloodTypes from './pages/admin/InternalBloodTypes';
import RevenueInsights from './pages/shared/RevenueInsights';
import DashboardLayout from './layouts/AdminLayout';
import BloodBankDashboard from './pages/bloodbank/BloodBankDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalMarketplace from './pages/hospital/HospitalMarketplace';
import HospitalUserManagement from './pages/hospital/HospitalUserManagement';
import HospitalTransactions from './pages/hospital/HospitalTransactions';
import Marketplace from './pages/user/Marketplace';
import SetupPasswordPage from './pages/auth/SetupPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyAccountPage from './pages/auth/VerifyAccountPage';
import BloodBankInventory from './pages/bloodbank/BloodBankInventory';
import BloodBankStaff from './pages/bloodbank/BloodBankStaff';
import BloodBankPOS from './pages/bloodbank/BloodBankPOS';
import BloodBankOrders from './pages/bloodbank/BloodBankOrders';
import BloodBankPricing from './pages/bloodbank/BloodBankPricing';
import BloodBankPayouts from './pages/bloodbank/BloodBankPayouts';
import BloodBankBankDetails from './pages/bloodbank/BloodBankBankDetails';
import AdminPayouts from './pages/admin/AdminPayouts';
import AdminBankDetails from './pages/admin/AdminBankDetails';
import GlobalConfig from './pages/admin/GlobalConfig';
import ProfileSettings from './pages/shared/ProfileSettings';

const AppLayout = ({ children, theme, toggleTheme, isPublic = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = isPublic ? [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ] : [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Admin', path: '/admin' },
    { name: 'Inventory', path: '/bloodbank' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'bg-nav-bg backdrop-blur-xl border-b border-glass-border py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="container max-w-7xl mx-auto flex justify-between items-center px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-glass p-2 rounded-xl border border-glass-border shadow-xl group-hover:scale-105 transition-all duration-500">
              <img src={logo} alt="SwiftAid" className="h-8 w-auto" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-bold uppercase tracking-widest transition-all ${location.pathname === link.path ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-glass-border mx-2" />
            
            <button 
              onClick={toggleTheme} 
              className="p-2 text-accent hover:bg-glass rounded-xl transition-all shadow-lg shadow-accent/5"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isPublic ? (
              <Link 
                to="/login" 
                className="btn btn-primary px-8 py-3 rounded-2xl shadow-xl shadow-accent/20 flex items-center gap-2 group"
              >
                <span className="text-xs font-black uppercase tracking-widest">Login</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button 
                onClick={() => { localStorage.clear(); window.location.href='/login'; }}
                className="btn btn-outline px-6 py-2 text-xs rounded-xl"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-accent hover:bg-glass rounded-xl transition-all shadow-lg shadow-accent/5"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-primary hover:bg-glass rounded-xl transition-all"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-nav-bg backdrop-blur-xl border-b border-glass-border shadow-2xl py-6 px-6 md:hidden flex flex-col gap-6"
            >
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-base font-bold uppercase tracking-widest transition-all ${location.pathname === link.path ? 'text-accent' : 'text-text-secondary'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-[1px] w-full bg-glass-border my-2" />
              {isPublic ? (
                <Link 
                  to="/login" 
                  className="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-sm font-black uppercase tracking-widest">Login</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <button 
                  onClick={() => { localStorage.clear(); window.location.href='/login'; }}
                  className="btn btn-outline px-6 py-4 text-sm rounded-xl w-full"
                >
                  Logout
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {isPublic && (
        <footer className="bg-bg-darker border-t border-glass-border py-20">
          <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-glass p-2 rounded-xl border border-glass-border shadow-xl">
                  <img src={logo} alt="SwiftAid" className="h-6 w-auto" />
                </div>
              </div>
              <p className="text-text-secondary max-w-sm leading-relaxed">
                Empowering the Nigerian healthcare system through rapid, verified, and intelligent blood coordination. Every second counts, every life matters.
              </p>
            </div>
            <div>
              <h4 className="text-text-primary font-black uppercase tracking-widest text-xs mb-6">Network</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link to="/join" className="hover:text-accent transition-colors">Enquiry for Hospital</Link></li>
                <li><Link to="/join" className="hover:text-accent transition-colors">Enquiry for Blood Bank</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-text-primary font-black uppercase tracking-widest text-xs mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="container max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-glass-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-text-muted">© 2026 SwiftAid Infrastructure. All rights reserved.</p>
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
            background: 'var(--color-bg-darker)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-glass-border)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '16px 24px',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
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
