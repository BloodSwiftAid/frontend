import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Droplet, 
  Hospital, 
  Users, 
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Bell
} from 'lucide-react';

const SidebarItem = ({ item, end }) => {
  return (
    <NavLink
      to={item.path}
      end={end}
      className={({ isActive }) => `
        flex items-center justify-between px-6 py-4 rounded-[20px] transition-all duration-500 group relative
        ${isActive 
          ? 'bg-accent text-white shadow-2xl shadow-accent/20' 
          : 'hover:bg-glass text-text-secondary hover:text-text-primary border border-transparent hover:border-glass-border'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-4 relative z-10">
            <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : 'group-hover:text-accent'}`} />
            <span className="font-bold tracking-tight">{item.label}</span>
          </div>
          <ChevronRight className={`w-4 h-4 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
          
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-hover opacity-20 blur-xl rounded-full" />
          )}
        </>
      )}
    </NavLink>
  );
};

const AdminSidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Executive Overview', path: '/admin' },
    { icon: Droplet, label: 'Blood Logistics', path: '/admin/blood-banks' },
    { icon: Hospital, label: 'Clinical Network', path: '/admin/hospitals' },
    { icon: Users, label: 'Identity Registry', path: '/admin/users' },
  ];

  return (
    <aside className="w-80 bg-card-bg/95 backdrop-blur-3xl border-r border-glass-border flex flex-col h-screen sticky top-0 z-[1000] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      <div className="p-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-accent rounded-[24px] flex items-center justify-center shadow-2xl shadow-accent/40 mb-6 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <ShieldCheck className="text-white w-8 h-8 relative z-10" />
        </div>
        <div>
          <h2 className="font-black text-2xl tracking-tighter text-white">SWIFTAID</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-black">Admin Core</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-6 ml-4">Command Center</p>
        {menuItems.map((item) => (
          <SidebarItem key={item.path} item={item} end={item.path === '/admin'} />
        ))}
      </nav>

      <div className="p-8 border-t border-glass-border bg-glass/10 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-8 bg-glass p-4 rounded-2xl border border-glass-border group cursor-pointer hover:border-accent/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center font-black text-accent border border-glass-border">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-black text-white truncate">Internal Admin</p>
            <p className="text-[10px] text-text-secondary truncate uppercase tracking-widest font-bold">Root Access</p>
          </div>
          <Settings className="w-4 h-4 text-text-muted group-hover:rotate-90 transition-transform" />
        </div>

        <button 
          onClick={() => { localStorage.clear(); window.location.href='/login'; }}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-[20px] text-text-secondary hover:text-accent border border-glass-border hover:border-accent/30 hover:bg-accent/5 transition-all w-full group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-black uppercase tracking-widest text-xs">Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
