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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-darker">
      {/* Sidebar - Responsive handling */}
      <div className={`fixed inset-y-0 left-0 z-[1000] lg:relative lg:block transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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
            className="fixed inset-0 bg-black/50 z-[900] lg:hidden"
          />
        )}
      </AnimatePresence>
      
      <main className="flex-1 relative overflow-y-auto h-screen custom-scrollbar">
        {/* Mobile Top Header */}
        <div className="lg:hidden h-14 bg-card-bg border-b border-glass-border px-4 flex items-center justify-between sticky top-0 z-[800]">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-text-primary hover:bg-glass rounded-lg"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-text-primary">SwiftAid</span>
          <div className="w-9 h-9 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-center">
            <ShieldAlert size={18} className={isVerified ? 'text-primary' : 'text-warning'} />
          </div>
        </div>

        {!isVerified && (
          <div className="bg-warning/10 border-b border-warning/20 px-6 py-3 flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-warning" />
            <p className="text-xs font-medium text-warning text-center">
              Facility verification pending. <span className="hidden sm:inline">You are currently in <span className="underline">View-Only</span> mode.</span>
            </p>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto min-h-full p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
