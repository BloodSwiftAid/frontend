import React from 'react';
import { 
  Droplet, 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  Clock, 
  ShieldCheck, 
  ShoppingCart,
  ArrowRight,
  Hospital as HospitalIcon,
  Heart
} from 'lucide-react';

const RequestHistory = () => (
  <div className="overflow-hidden border border-glass-border rounded-[32px] bg-card-bg/40 backdrop-blur-xl">
    <table className="w-full text-left text-sm">
      <thead className="bg-glass/50 border-b border-glass-border">
        <tr>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Request ID</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Type</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Quantity</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Timeframe</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Status</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-glass-border/30">
        {[
          { id: 'REQ-9012', type: 'O+', qty: 2, time: '14 mins ago', status: 'In Transit' },
          { id: 'REQ-8945', type: 'AB-', qty: 1, time: '2 hours ago', status: 'Fulfilled' },
          { id: 'REQ-8821', type: 'B+', qty: 4, time: '1 day ago', status: 'Fulfilled' },
        ].map((item, i) => (
          <tr key={i} className="hover:bg-accent/5 transition-all group">
            <td className="px-8 py-6 font-mono text-text-muted font-bold">{item.id}</td>
            <td className="px-8 py-6 font-black text-white text-lg">{item.type}</td>
            <td className="px-8 py-6 font-black text-white">{item.qty} Units</td>
            <td className="px-8 py-6 text-text-secondary font-bold uppercase tracking-widest text-[10px]">{item.time}</td>
            <td className="px-8 py-6">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                item.status === 'In Transit' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              }`}>
                {item.status}
              </span>
            </td>
            <td className="px-8 py-6 text-right">
              <button className="text-accent font-black text-[10px] uppercase tracking-widest hover:underline">Track Order</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const HospitalDashboard = () => {
  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10 pt-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white">Clinical <span className="text-gradient">Console</span></h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <HospitalIcon className="w-3 h-3 text-blue-500" />
            St. Nicholas Hospital | Emergency Node
          </p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 gap-3 group">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold tracking-tight">Request Urgent Blood</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] hover:border-accent/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="p-4 bg-accent/10 text-accent rounded-2xl w-fit mb-6">
              <Clock className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Average Response</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">18.5m</h3>
          </div>
        </div>
        
        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mb-6">
              <Heart className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Total Units Procured</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">1,204</h3>
          </div>
        </div>

        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl w-fit mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Safety Score</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">99.8%</h3>
          </div>
        </div>
      </div>

      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-white">Request Timeline</h2>
            <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest">Active and historical procurement logs</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="flex-1 lg:w-96 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-accent/50 transition-all" 
                placeholder="Search clinical requests..." 
              />
            </div>
            <button className="btn btn-outline px-8 rounded-2xl gap-3">
              <Filter className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-[10px]">Filter History</span>
            </button>
          </div>
        </div>
        
        <RequestHistory />
      </div>
    </div>
  );
};

export default HospitalDashboard;
