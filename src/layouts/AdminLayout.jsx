import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import DashboardSidebar from '../components/admin/AdminSidebar';

const DashboardLayout = ({ children, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
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

  if (!authorized) {
    return (
      <div className="min-h-screen bg-bg-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-darker relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <DashboardSidebar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 relative overflow-y-auto">
        {!isVerified && (
          <div className="bg-accent/10 border-b border-accent/20 px-8 py-3 flex items-center justify-center gap-3 relative z-[1000] backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-accent animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              Facility verification pending. You are currently in <span className="underline">View-Only</span> mode. Reach out to admin for full access.
            </p>
          </div>
        )}
        <div className="max-w-[1400px] mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
