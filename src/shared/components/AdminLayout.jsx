import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Menu, X } from 'lucide-react';
import DashboardSidebar from '../../features/admin/components/AdminSidebar';
import { AnimatePresence, motion } from 'framer-motion';

const DashboardLayout = ({ children, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authorized, setAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isVerified = localStorage.getItem('facility_verified') === 'true' || localStorage.getItem('role') === 'INTERNAL_ADMIN';

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const allowedRoles = ['INTERNAL_ADMIN', 'BLOODBANK_ADMIN', 'HOSPITAL_ADMIN', 'BLOODBANK_STAFF', 'HOSPITAL_STAFF'];
    if (!allowedRoles.includes(role)) {
      navigate('/marketplace');
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-bg-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-darker relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Sidebar - Responsive handling */}
      <div className={`fixed inset-y-0 left-0 z-[1000] lg:relative lg:block transition-all duration-500 ${isSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0 w-80'}`}>
        <DashboardSidebar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900] lg:hidden"
          />
        )}
      </AnimatePresence>
      
      <main className="flex-1 relative overflow-y-auto h-screen custom-scrollbar">
        {/* Mobile Top Header */}
        <div className="lg:hidden h-16 bg-card-bg/40 backdrop-blur-xl border-b border-glass-border px-6 flex items-center justify-between sticky top-0 z-[800]">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-glass border border-glass-border rounded-xl text-primary"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">SwiftAid</span>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-center">
            <ShieldAlert size={18} className={isVerified ? 'text-primary' : 'text-accent'} />
          </div>
        </div>

        {!isVerified && (
          <div className="bg-accent/10 border-b border-accent/20 px-8 py-3 flex items-center justify-center gap-3 relative z-[100] backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-accent animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent text-center">
              Facility verification pending. <span className="hidden sm:inline">You are currently in <span className="underline">View-Only</span> mode.</span>
            </p>
          </div>
        )}
        
        <div className="max-w-[1400px] mx-auto min-h-full p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

