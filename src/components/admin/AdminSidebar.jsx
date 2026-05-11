import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Activity,
  ArrowLeftRight,
  Bell,
  ChevronRight,
  ClipboardList,
  Droplet,
  Hospital,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Sun,
  Moon,
  DollarSign,
  CreditCard,
  X
} from 'lucide-react';
import logo from '../../assets/logo.png';

const SidebarItem = ({ item, end }) => {
  const Icon = item.icon;
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
            {Icon && <Icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : 'group-hover:text-accent'}`} />}
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

const DashboardSidebar = ({ theme, toggleTheme, onClose }) => {
  const role = localStorage.getItem('role');
  
  const getMenuItems = () => {
    switch (role) {
      case 'INTERNAL_ADMIN':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
          { icon: DollarSign, label: 'Revenue Insights', path: '/admin/revenue' },
          { icon: CreditCard, label: 'Payouts', path: '/admin/payouts' },
          { icon: Settings, label: 'System Config', path: '/admin/config' },
          { icon: Droplet, label: 'Blood Types', path: '/admin/blood-types' },
          { icon: ArrowLeftRight, label: 'Blood Requests', path: '/admin/requests' },
          { icon: Droplet, label: 'Blood Banks', path: '/admin/blood-banks' },
          { icon: Hospital, label: 'Hospitals', path: '/admin/hospitals' },
          { icon: Users, label: 'User Management', path: '/admin/users' },
        ];
      case 'BLOODBANK_ADMIN':
      case 'BLOODBANK_STAFF':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/bloodbank' },
          { icon: Users, label: 'Staff Management', path: '/bloodbank/staff' },
          { icon: Package, label: 'Inventory', path: '/bloodbank/inventory' },
          { icon: DollarSign, label: 'Revenue Insights', path: '/bloodbank/revenue' },
          { icon: CreditCard, label: 'Payouts', path: '/bloodbank/payouts' },
          { icon: ShoppingCart, label: 'Point of Sale', path: '/bloodbank/pos' },
          { icon: ArrowLeftRight, label: 'Order History', path: '/bloodbank/orders' },
        ];
      case 'HOSPITAL_ADMIN':
      case 'HOSPITAL_STAFF':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/hospital' },
          { icon: ShoppingCart, label: 'Marketplace', path: '/hospital/marketplace' },
          { icon: ArrowLeftRight, label: 'Purchase History', path: '/hospital/transactions' },
          { icon: Users, label: 'Team', path: '/hospital/users' },
        ];
      default:
        return [
          { icon: LayoutDashboard, label: 'Marketplace', path: '/marketplace' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-80 bg-card-bg/95 backdrop-blur-3xl border-r border-glass-border flex flex-col h-screen sticky top-0 z-[1000] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-6 right-6 p-2 bg-glass border border-glass-border rounded-xl text-accent z-50"
      >
        <X size={20} />
      </button>

      <div className="p-10 flex flex-col items-center">
        <div className="w-full flex justify-center mb-8">
          <Link to="/" className="bg-glass p-3 rounded-2xl border border-glass-border shadow-xl group hover:scale-105 transition-all duration-500">
            <img src={logo} alt="SwiftAid" className="h-10 w-auto" />
          </Link>
        </div>
        <div className="text-center">
          <h2 className="font-black text-xl tracking-tighter text-text-primary uppercase">Swift<span className="text-gradient">Aid</span></h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[9px] uppercase tracking-[0.3em] text-accent font-black">
              {typeof role === 'string' ? role.replace(/_/g, ' ') : 'User Access'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-3 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-6 ml-4">Command Center</p>
        {menuItems.map((item) => (
          <SidebarItem key={item.path} item={item} end={item.path === '/admin'} />
        ))}
      </nav>

      <div className="p-8 border-t border-glass-border bg-glass/10 backdrop-blur-sm">
        <NavLink 
          to={`${role === 'INTERNAL_ADMIN' ? '/admin' : role === 'BLOODBANK_ADMIN' ? '/bloodbank' : '/hospital'}/settings`}
          className="flex items-center gap-4 mb-8 bg-glass p-4 rounded-2xl border border-glass-border group cursor-pointer hover:border-accent/30 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center font-black text-accent border border-glass-border">
            {role?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-black text-text-primary truncate">
              {typeof role === 'string' ? role.replace(/_/g, ' ') : 'Guest User'}
            </p>
            <p className="text-[10px] text-text-secondary truncate uppercase tracking-widest font-bold">Authorized Operator</p>
          </div>
          <Settings className="w-4 h-4 text-text-muted group-hover:rotate-90 transition-transform" />
        </NavLink>

        <div className="flex justify-between items-center gap-4 mb-6">
           <div className="flex-1 p-3 bg-glass border border-glass-border rounded-xl flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">Interface Mode</span>
              <button 
                onClick={toggleTheme}
                className="p-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
           </div>
        </div>

        <button 
          onClick={() => { localStorage.clear(); window.location.href='/login'; }}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-[20px] text-text-secondary hover:text-accent border border-glass-border hover:border-accent/30 hover:bg-accent/5 transition-all w-full group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-black uppercase tracking-widest text-xs">Logout</span>
        </button>
      </div>
    </aside>
  );
};


export default DashboardSidebar;
