import React, { useState, useEffect } from 'react';
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
  Droplet,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { inventoryApi, transactionApi } from '../../api';

const InventoryTable = ({ data, loading }) => (
  <div className="overflow-hidden border border-glass-border rounded-[32px] bg-card-bg/40 backdrop-blur-xl">
    {loading ? (
      <div className="p-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    ) : (
      <table className="w-full text-left text-sm">
        <thead className="bg-glass/50 border-b border-glass-border">
          <tr>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Group</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Availability</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Unit Valuation</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Status</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Fulfillment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-glass-border/30">
          {data.map((item, i) => (
            <tr key={item.id} className="hover:bg-accent/5 transition-all group">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center font-black text-accent text-xl">
                    {item.blood_group}
                  </div>
                  <span className="font-black text-text-primary text-lg">{item.blood_group} Units</span>
                </div>
              </td>
              <td className="px-8 py-6 font-black text-text-primary text-lg">{item.quantity} Units</td>
              <td className="px-8 py-6 font-mono text-emerald-500 font-black">₦{item.price?.toLocaleString()}</td>
              <td className="px-8 py-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.quantity > 10 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  item.quantity > 0 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-accent/10 text-accent border border-accent/20'
                }`}>
                  {item.quantity > 10 ? 'Optimum' : item.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <button className="p-3 hover:bg-glass rounded-xl text-text-muted hover:text-accent transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="5" className="px-8 py-24">
                <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                  <div className="p-4 bg-glass border border-glass-border rounded-2xl">
                    <Droplet className="w-8 h-8 text-text-muted" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">No units found in inventory</p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
);

const BloodBankDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    total_units: 0,
    active_requests: 0,
    critical_stock: 0,
    wallet_balance: 0
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 1500);
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding_seen', 'true');
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [invRes, statsRes, reqRes, meRes] = await Promise.all([
        inventoryApi.listInventory(),
        inventoryApi.getStats(),
        transactionApi.listRequests(),
        usersApi.getMe()
      ]);
      
      const inventoryData = (invRes.data.results || invRes.data).filter(i => i.quantity > 0);
      setInventory(inventoryData.slice(0, 5)); // Show top 5 active assets
      
      const totalUnits = inventoryData.reduce((acc, curr) => acc + curr.quantity, 0);
      const critical = inventoryData.filter(i => i.quantity < 5).length;
      const requests = reqRes.data.results || reqRes.data;
      const activeReqs = requests.filter(r => r.status === 'PENDING').length;
      
      const profileData = meRes.data.profile_details;
      setProfile(profileData);

      setStats({
        total_units: totalUnits,
        active_requests: activeReqs,
        critical_stock: critical,
        wallet_balance: profileData?.blood_bank_details?.wallet_balance || 0
      });
    } catch (err) {
      console.error('Dashboard sync failure:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            {profile?.blood_bank_details?.name || 'Dashboard'}
          </h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] opacity-70">
            <Activity className="w-3 h-3 text-emerald-500" />
            System Status: Operational | Facility
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-700 relative overflow-hidden min-h-[220px]">
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
            <DollarSign className="w-32 h-32 text-emerald-500" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Wallet Balance</p>
            <h4 className="text-4xl font-black text-text-primary tracking-tighter leading-none">
              ₦{parseFloat(stats.wallet_balance).toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-blue-500/30 transition-all duration-700 relative overflow-hidden min-h-[220px]">
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
            <Package className="w-32 h-32 text-blue-500" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Inventory Units</p>
            <h4 className="text-5xl font-black text-text-primary tracking-tighter leading-none">{stats.total_units}</h4>
          </div>
        </div>

        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-amber-500/30 transition-all duration-700 relative overflow-hidden min-h-[220px]">
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
            <Zap className="w-32 h-32 text-amber-500" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Pending Orders</p>
            <h4 className="text-5xl font-black text-text-primary tracking-tighter leading-none">{stats.active_requests}</h4>
          </div>
        </div>

        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-accent/30 transition-all duration-700 relative overflow-hidden min-h-[220px]">
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
            <AlertTriangle className="w-32 h-32 text-accent" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Critical Alert</p>
            <h4 className="text-5xl font-black text-text-primary tracking-tighter leading-none">{stats.critical_stock}</h4>
          </div>
        </div>
      </div>

      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Inventory <span className="text-gradient">Preview</span></h2>
            <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest">Available Blood Stock Levels</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button 
              onClick={() => window.location.href = '/bloodbank/inventory'}
              className="btn btn-outline px-8 py-4 rounded-2xl gap-3 group"
            >
              <span className="font-black uppercase tracking-widest text-[10px]">Full Inventory View</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <InventoryTable data={inventory} loading={loading} />
      </div>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-darker/60 backdrop-blur-md" />
          <div className="bg-card-bg border border-glass-border rounded-[48px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-accent/20 rounded-2xl">
                  <Zap className="w-6 h-6 text-accent animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-text-primary tracking-tighter uppercase">Operator <span className="text-gradient">Welcome</span></h2>
              </div>
              
              <div className="space-y-6 mb-12">
                {[
                  { icon: Package, title: 'Inventory Management', desc: 'Monitor and manage your blood stock levels in real-time.' },
                  { icon: DollarSign, title: 'Earnings & Pricing', desc: 'Configure unit valuations and pricing for the marketplace.' },
                  { icon: ArrowDownLeft, title: 'Order History', desc: 'Track fulfillment requests and dispatch logs seamlessly.' }
                ].map((hint, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-glass/20 border border-glass-border rounded-3xl group hover:border-accent/30 transition-all">
                    <div className="p-3 bg-glass rounded-xl text-text-muted group-hover:text-accent transition-colors">
                      <hint.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-text-primary uppercase tracking-tight">{hint.title}</h4>
                      <p className="text-sm text-text-secondary mt-1">{hint.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={dismissOnboarding}
                className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 uppercase font-black tracking-widest"
              >
                Enter Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankDashboard;
