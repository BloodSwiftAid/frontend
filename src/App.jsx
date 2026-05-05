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

import logo from './assets/logo.png';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Join from './pages/Join';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BloodBankManagement from './pages/admin/BloodBankManagement';
import HospitalManagement from './pages/admin/HospitalManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminLayout from './layouts/AdminLayout';
import BloodBankDashboard from './pages/bloodbank/BloodBankDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import Marketplace from './pages/user/Marketplace';
import SetupPasswordPage from './pages/auth/SetupPasswordPage';

const AppLayout = ({ children, theme, toggleTheme, isPublic = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Droplet className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">SWIFTAID</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-bold uppercase tracking-widest transition-all ${location.pathname === link.path ? 'text-accent' : 'text-text-secondary hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-glass-border mx-2" />
            
            <button 
              onClick={toggleTheme} 
              className="p-2 text-text-primary hover:bg-glass rounded-xl transition-all"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isPublic ? (
              <Link 
                to="/login" 
                className="btn btn-primary px-8 py-3 rounded-2xl shadow-xl shadow-accent/20 flex items-center gap-2 group"
              >
                <span className="text-xs font-black uppercase tracking-widest">Portal Access</span>
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
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {isPublic && (
        <footer className="bg-bg-darker border-t border-glass-border py-20">
          <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Droplet className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">SWIFTAID</span>
              </div>
              <p className="text-text-secondary max-w-sm leading-relaxed">
                Empowering the Nigerian healthcare system through rapid, verified, and intelligent blood coordination. Every second counts, every life matters.
              </p>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Network</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link to="/join" className="hover:text-accent transition-colors">Join as Hospital</Link></li>
                <li><Link to="/join" className="hover:text-accent transition-colors">Become supply partner</Link></li>
                <li><Link to="/donors" className="hover:text-accent transition-colors">Donor Information</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Protocol</Link></li>
                <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Engagement</Link></li>
              </ul>
            </div>
          </div>
          <div className="container max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-glass-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-text-muted">© 2026 SwiftAid Infrastructure. All rights reserved.</p>
            <div className="flex gap-6">
               <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 System Operational
               </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
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
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/blood-banks" element={<BloodBankManagement />} />
              <Route path="/hospitals" element={<HospitalManagement />} />
              <Route path="/users" element={<UserManagement />} />
            </Routes>
          </AdminLayout>
        } />
        <Route path="/bloodbank/*" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme}><BloodBankDashboard /></AppLayout>
        } />
        <Route path="/marketplace" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme}><Marketplace /></AppLayout>
        } />
        <Route path="/hospital/*" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme}><HospitalDashboard /></AppLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
