import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/admin/AdminSidebar';

const DashboardLayout = ({ children, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const allowedRoles = ['INTERNAL_ADMIN', 'BLOODBANK_ADMIN', 'HOSPITAL_ADMIN'];
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
        <div className="max-w-[1400px] mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
