import React from 'react';
import { 
  Package, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle,
  Search,
  Filter,
  Zap,
  Activity,
  ChevronRight,
  Droplet
} from 'lucide-react';

const InventoryTable = () => (
  <div className="overflow-hidden border border-glass-border rounded-[32px] bg-card-bg/40 backdrop-blur-xl">
    <table className="w-full text-left text-sm">
      <thead className="bg-glass/50 border-b border-glass-border">
        <tr>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Group</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Category</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Quantity</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Expiry Date</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Status</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-glass-border/30">
        {[
          { group: 'O+', category: 'Whole Blood', qty: 24, expiry: '2026-06-15', status: 'Healthy' },
          { group: 'A-', category: 'Plasma', qty: 5, expiry: '2026-05-10', status: 'Low Stock' },
          { group: 'B+', category: 'Platelets', qty: 12, expiry: '2026-05-20', status: 'Expiring Soon' },
        ].map((item, i) => (
          <tr key={i} className="hover:bg-accent/5 transition-all group">
            <td className="px-8 py-6 font-black text-white text-lg">{item.group}</td>
            <td className="px-8 py-6 text-text-secondary font-bold uppercase tracking-widest text-[10px]">{item.category}</td>
            <td className="px-8 py-6 font-black text-white">{item.qty} Units</td>
            <td className="px-8 py-6 text-text-muted font-mono">{item.expiry}</td>
            <td className="px-8 py-6">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                item.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                item.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-accent/10 text-accent border border-accent/20'
              }`}>
                {item.status}
              </span>
            </td>
            <td className="px-8 py-6 text-right">
              <button className="text-accent font-black text-[10px] uppercase tracking-widest hover:underline">Update Stock</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BloodBankDashboard = () => {
  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10 pt-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white">Inventory <span className="text-gradient">Hub</span></h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Activity className="w-3 h-3 text-emerald-500" />
            Lagos Central Facility | Operational
          </p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 gap-3 group">
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span className="font-bold tracking-tight">Add New Units</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mb-6">
              <ArrowDownLeft className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Available Capacity</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">412 Units</h3>
          </div>
        </div>
        
        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl w-fit mb-6">
              <Package className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Active Shipments</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">12 Orders</h3>
          </div>
        </div>

        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] hover:border-accent/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="p-4 bg-accent/10 text-accent rounded-2xl w-fit mb-6">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Critical Expiry</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">8 Units</h3>
          </div>
        </div>
      </div>

      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-white">Live Inventory</h2>
            <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest">Real-time sync with SwiftAid Cloud</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="flex-1 lg:w-96 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-accent/50 transition-all" 
                placeholder="Search inventory matrix..." 
              />
            </div>
            <button className="btn btn-outline px-8 rounded-2xl gap-3">
              <Filter className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-[10px]">Filter Matrix</span>
            </button>
            <button className="btn btn-primary px-8 rounded-2xl shadow-xl shadow-accent/20">
              <span className="font-black uppercase tracking-widest text-[10px]">Direct Fulfillment</span>
            </button>
          </div>
        </div>
        
        <InventoryTable />
      </div>
    </div>
  );
};

export default BloodBankDashboard;
