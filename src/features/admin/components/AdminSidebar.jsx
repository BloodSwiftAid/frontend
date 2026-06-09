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
import logo from '../../../assets/logo.png';

const SidebarItem = ({ item, end }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={end}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive 
          ? 'bg-primary text-white shadow-sm shadow-primary/20' 
          : 'text-text-secondary hover:text-text-primary hover:bg-glass'}
      `}
    >
      {({ isActive }) => (
        <>
          {Icon && <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />}
          <span className="font-medium text-sm">{item.label}</span>
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
          { icon: Droplet, label: 'Blood Banks', path: '/admin/blood-banks' },
          { icon: Hospital, label: 'Hospitals', path: '/admin/hospitals' },
          { icon: ClipboardList, label: 'Enquiries', path: '/admin/enquiries' },
          { icon: Droplet, label: 'Blood Types', path: '/admin/blood-types' },
          { icon: ArrowLeftRight, label: 'Blood Requests', path: '/admin/requests' },
          { icon: Users, label: 'User Management', path: '/admin/users' },
          { icon: CreditCard, label: 'Payouts', path: '/admin/payouts' },
          { icon: Settings, label: 'System Config', path: '/admin/config' },
        ];
      case 'BLOODBANK_ADMIN':
      case 'BLOODBANK_STAFF':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/bloodbank' },
          { icon: Package, label: 'Inventory', path: '/bloodbank/inventory' },
          { icon: ShoppingCart, label: 'Point of Sale', path: '/bloodbank/pos' },
          { icon: ArrowLeftRight, label: 'Order History', path: '/bloodbank/orders' },
          { icon: Users, label: 'Staff Management', path: '/bloodbank/staff' },
          { icon: DollarSign, label: 'Revenue Insights', path: '/bloodbank/revenue' },
          { icon: CreditCard, label: 'Payouts', path: '/bloodbank/payouts' },
        ];
      case 'HOSPITAL_ADMIN':
      case 'HOSPITAL_STAFF':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/hospital' },
          { icon: ShoppingCart, label: 'Marketplace', path: '/hospital/marketplace' },
          { icon: ArrowLeftRight, label: 'Transaction History', path: '/hospital/transactions' },
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
    <aside className="w-72 bg-card-bg border-r border-glass-border flex flex-col h-screen sticky top-0 z-[1000]">
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-glass rounded-lg transition-all z-50"
      >
        <X size={20} />
      </button>

      <div className="p-6 border-b border-glass-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg border border-primary/10">
            <img src={logo} alt="SwiftAid" className="h-8 w-auto" />
          </div>
          <span className="font-bold text-lg text-text-primary">SwiftAid</span>
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <p className="text-xs uppercase tracking-wide text-text-muted font-medium">
            {typeof role === 'string' ? role.replace(/_/g, ' ') : 'User Access'}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="text-[11px] uppercase tracking-wider text-text-muted px-4 mb-3 font-medium">Navigation</p>
        {menuItems.map((item) => (
          <SidebarItem key={item.path} item={item} end={item.path === '/admin' || item.path === '/bloodbank' || item.path === '/hospital'} />
        ))}
      </nav>

      <div className="p-4 border-t border-glass-border">
        <NavLink 
          to={`${role === 'INTERNAL_ADMIN' ? '/admin' : role === 'BLOODBANK_ADMIN' ? '/bloodbank' : '/hospital'}/settings`}
          className="flex items-center gap-3 mb-4 p-3 rounded-xl hover:bg-glass transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
            {role?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-text-primary truncate">
              {typeof role === 'string' ? role.replace(/_/g, ' ') : 'Guest User'}
            </p>
            <p className="text-xs text-text-muted truncate">Account Settings</p>
          </div>
          <Settings className="w-4 h-4 text-text-muted" />
        </NavLink>

        <div className="flex items-center justify-between gap-3 mb-4">
           <span className="text-xs text-text-muted">Theme</span>
           <button 
             onClick={toggleTheme}
             className="p-2 text-text-secondary hover:text-text-primary hover:bg-glass rounded-lg transition-all"
           >
             {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
           </button>
        </div>

        <button 
          onClick={() => { localStorage.clear(); window.location.href='/login'; }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-text-secondary hover:text-error hover:bg-error/5 border border-glass-border hover:border-error/20 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};


export default DashboardSidebar;
