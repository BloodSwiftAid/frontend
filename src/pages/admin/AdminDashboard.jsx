import React, { useState, useEffect } from 'react';
import { adminApi, transactionApi } from '../../api';
import { 
  Users, 
  Building2, 
  Hospital, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Zap,
  Calendar,
  Droplet,
  Globe,
  ChevronRight,
  ExternalLink,
  Loader2,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    blood_banks: 0,
    hospitals: 0,
    total_users: 0,
    pending_verifications: 0
  });
  const [liveActivity, setLiveActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        adminApi.getSystemStats(),
        transactionApi.getLiveActivity()
      ]);
      if (statsRes.data) setStats(prev => ({ ...prev, ...statsRes.data }));
      if (activityRes.data) setLiveActivity(activityRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Revenue', 
      value: `₦${parseFloat(stats.platform_wallet || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      trend: 'Live',
      isPositive: true 
    },
    { 
      label: 'Blood Banks', 
      value: stats.blood_banks, 
      icon: Building2, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      trend: '+12%',
      isPositive: true 
    },
    { 
      label: 'Hospitals', 
      value: stats.hospitals, 
      icon: Hospital, 
      color: 'text-accent', 
      bg: 'bg-accent/10',
      trend: '+5%',
      isPositive: true 
    },
    { 
      label: 'Total Users', 
      value: stats.total_users, 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      trend: '+18%',
      isPositive: true 
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Syncing Cluster...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Admin <span className="text-primary">Portal</span>
          </h1>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">
            <Globe className="w-3.5 h-3.5 text-primary" />
            Node Sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="relative group bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] transition-all duration-500 hover:border-primary/30 shadow-sm">
            <div className="flex justify-between items-start mb-6 md:mb-12">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${card.bg} ${card.color} flex items-center justify-center border border-glass-border shadow-lg`}>
                <card.icon size={20} className="md:w-7 md:h-7" />
              </div>
              <div className={`hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${card.isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-accent/10 border-accent/20 text-accent'}`}>
                {card.trend}
              </div>
            </div>
            
            <div>
              <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-xl md:text-4xl font-black text-text-primary tracking-tighter leading-none truncate">{card.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Real-time Activity */}
        <div className="lg:col-span-2 bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-3xl md:rounded-[56px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 md:p-10 border-b border-glass-border bg-glass/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black flex items-center gap-4 text-text-primary uppercase tracking-tighter">
                <Activity className="text-primary w-6 h-6 animate-pulse" />
                Live <span className="text-primary">Activity</span>
              </h2>
              <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-1">Real-time biological registry</p>
            </div>
            <span className="flex items-center gap-3 text-[9px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Grid
            </span>
          </div>
          
          <div className="divide-y divide-glass-border/30 max-h-[500px] overflow-y-auto no-scrollbar">
            {liveActivity.length > 0 ? liveActivity.map((activity) => (
              <div key={activity.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 md:p-8 hover:bg-primary/5 transition-all group relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-500 ${
                  activity.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                  activity.status === 'PENDING' ? 'bg-accent/10 border-accent/20 text-accent' :
                  'bg-primary/10 border-primary/20 text-primary'
                }`}>
                  <Droplet size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-black text-text-primary text-base uppercase tracking-tight truncate">{activity.facility}</p>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                      activity.source === 'POS' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-accent/10 border-accent/20 text-accent'
                    }`}>
                      {activity.source}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary font-black uppercase tracking-tight opacity-70">
                    {activity.quantity} Units • ₦{activity.amount.toLocaleString()}
                  </p>
                </div>
                <div className="w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end shrink-0 gap-2">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${
                    activity.status === 'DELIVERED' ? 'text-emerald-500' : 'text-accent'
                  }`}>
                    {activity.status}
                    <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center opacity-40">
                <Zap className="w-10 h-10 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">No telemetry detected</p>
              </div>
            )}
          </div>
          
          <button className="p-6 md:p-8 text-center text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors border-t border-glass-border">
             View Protocol History
             <ExternalLink size={12} className="inline-block ml-3" />
          </button>
        </div>

        {/* Intelligence Module */}
        <div className="bg-bg-darker border border-glass-border rounded-3xl md:rounded-[56px] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group shadow-2xl min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
          
          <div className="relative z-10 space-y-8">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 backdrop-blur-xl">
               <Zap className="w-7 h-7 md:w-8 md:h-8 text-primary fill-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-tighter leading-none">
              SwiftAid<br/><span className="text-primary">Intelligence</span>
            </h2>
            
            <div className="space-y-4 md:space-y-6">
              <div className="p-5 md:p-6 bg-glass border border-glass-border rounded-2xl md:rounded-3xl backdrop-blur-3xl transition-all">
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                   <TrendingUp size={16} className="text-primary" />
                   <p className="text-[9px] font-black text-primary uppercase tracking-widest">Forecast</p>
                </div>
                <p className="text-[12px] md:text-[13px] text-text-secondary font-black uppercase tracking-tight leading-relaxed">
                   Demands indicates a <span className="text-primary font-black">18% surge</span> within 72 hours.
                </p>
              </div>
              
              <div className="p-5 md:p-6 bg-glass border border-glass-border rounded-2xl md:rounded-3xl backdrop-blur-3xl transition-all">
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                   <ShieldAlert size={16} className="text-accent" />
                   <p className="text-[9px] font-black text-accent uppercase tracking-widest">Grid Status</p>
                </div>
                <p className="text-[12px] md:text-[13px] text-text-secondary font-black uppercase tracking-tight leading-relaxed">
                   Clinical utilization at <span className="text-accent font-black">84%</span>. Balancing recommended.
                </p>
              </div>
            </div>
          </div>
          
          <button className="relative z-10 mt-8 btn btn-primary w-full py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
            Authorize Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
