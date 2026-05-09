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
  Loader2
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
    const interval = setInterval(fetchData, 30000); // Update every 30s
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
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      trend: '+18%',
      isPositive: true 
    },
    { 
      label: 'Pending Approvals', 
      value: stats.pending_verifications, 
      icon: ShieldAlert, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      trend: '-2%',
      isPositive: false 
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-8">
        <div className="relative w-20 h-20">
           <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
           <Activity className="absolute inset-0 m-auto w-8 h-8 text-accent animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-text-secondary flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
            <Globe className="w-3.5 h-3.5 text-accent" />
            System Pulse: {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-4">
          {/* Action buttons removed as per user request */}
        </div>
      </header>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="relative group bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-10 rounded-[48px] transition-all duration-700 hover:border-accent/40 shadow-sm hover:shadow-2xl hover:shadow-accent/5">
            <div className="flex justify-between items-start mb-10">
              <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center border border-glass-border shadow-xl shadow-black/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <card.icon className="w-7 h-7" />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${card.isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-accent/10 border-accent/20 text-accent'}`}>
                {card.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {card.trend}
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-2">{card.label}</p>
              <h3 className="text-5xl font-black text-text-primary tracking-tighter leading-none">{card.value.toLocaleString()}</h3>
            </div>

            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none group-hover:scale-125">
              <card.icon className="w-24 h-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Real-time Activity */}
        <div className="lg:col-span-2 bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[56px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-glass-border bg-glass/20 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-3xl font-black flex items-center gap-6 text-text-primary uppercase tracking-tighter">
                <Activity className="text-accent w-8 h-8 animate-pulse" />
                Recent <span className="text-gradient">Activity</span>
              </h2>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mt-2">Real-time biological request fulfillment registry</p>
            </div>
            <span className="flex items-center gap-3 text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
              Active Sync
            </span>
          </div>
          
          <div className="divide-y divide-glass-border/30 max-h-[600px] overflow-y-auto custom-scrollbar">
            {liveActivity.length > 0 ? liveActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-8 p-10 hover:bg-accent/5 transition-all group relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all duration-500 shadow-xl ${
                  activity.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                  activity.status === 'PENDING' ? 'bg-accent/10 border-accent/20 text-accent' :
                  'bg-primary/10 border-primary/20 text-primary'
                } group-hover:scale-105 group-hover:rotate-3`}>
                  <Droplet className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-1">
                    <p className="font-black text-text-primary text-xl tracking-tight uppercase">{activity.type} Asset Fulfillment</p>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      activity.source === 'POS' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-accent/10 border-accent/20 text-accent'
                    }`}>
                      {activity.source}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary font-black uppercase tracking-tight truncate opacity-80">
                    <span className="text-text-primary">{activity.facility}</span> processed <span className="text-accent">{activity.quantity} Units</span> • ₦{activity.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className={`flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${
                    activity.status === 'DELIVERED' ? 'text-emerald-500' : 'text-accent'
                  }`}>
                    {activity.status}
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-32 text-center space-y-8 opacity-40">
                <div className="w-20 h-20 bg-glass border border-glass-border rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-text-muted" />
                </div>
                <p className="text-text-muted font-black uppercase tracking-[0.5em] text-[10px]">No recent telemetry detected in the grid</p>
              </div>
            )}
          </div>
          
          <button className="p-8 text-center text-[10px] font-black uppercase tracking-[0.5em] text-text-muted hover:text-accent transition-colors border-t border-glass-border group">
             View Complete Protocol History
             <ExternalLink className="w-3.5 h-3.5 inline-block ml-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Intelligence Module */}
        <div className="bg-bg-darker border border-glass-border rounded-[56px] p-12 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 opacity-50" />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/20 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/20 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-accent/10 rounded-[32px] flex items-center justify-center mb-10 border border-accent/20 shadow-2xl backdrop-blur-xl group-hover:rotate-6 transition-transform duration-500">
               <Zap className="w-10 h-10 text-accent fill-accent" />
            </div>
            <h2 className="text-4xl font-black text-text-primary mb-8 uppercase tracking-tighter leading-none">SwiftAid<br/><span className="text-gradient">Intelligence</span></h2>
            
            <div className="space-y-8">
              <div className="p-8 bg-glass border border-glass-border rounded-[40px] backdrop-blur-3xl group-hover:border-accent/40 transition-all shadow-inner">
                <div className="flex items-center gap-4 mb-4">
                   <TrendingUp className="w-5 h-5 text-accent" />
                   <p className="text-[11px] font-black text-accent uppercase tracking-[0.3em]">Demand Forecast</p>
                </div>
                <p className="text-sm text-text-secondary font-black uppercase tracking-tight leading-relaxed">
                  Predictive models indicate a <span className="text-accent font-black">18% surge</span> in O- demand within Lagos Metropolitan over the next 72 hours.
                </p>
              </div>
              
              <div className="p-8 bg-glass border border-glass-border rounded-[40px] backdrop-blur-3xl group-hover:border-primary/40 transition-all shadow-inner">
                <div className="flex items-center gap-4 mb-4">
                   <ShieldAlert className="w-5 h-5 text-primary" />
                   <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Network Integrity</p>
                </div>
                <p className="text-sm text-text-secondary font-black uppercase tracking-tight leading-relaxed">
                   Clinical utilization is at <span className="text-primary font-black">84%</span>. Recommend initializing stock transfers to East-Grid facilities.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 relative z-10 space-y-6">
            <button className="btn btn-primary w-full py-6 rounded-[28px] shadow-2xl shadow-accent/40 font-black uppercase tracking-[0.4em] text-xs hover:scale-105 transition-all">
              Authorize Grid Balance
            </button>
            <div className="flex items-center justify-center gap-4">
               <div className="h-px flex-1 bg-glass-border/30" />
               <p className="text-[9px] font-black text-text-muted/60 uppercase tracking-[0.5em] whitespace-nowrap">AI-Driven Decision Support</p>
               <div className="h-px flex-1 bg-glass-border/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
