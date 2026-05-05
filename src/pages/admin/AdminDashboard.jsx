import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
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
  Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  console.log('AdminDashboard rendering...');
  const [stats, setStats] = useState({
    blood_banks: 0,
    hospitals: 0,
    total_users: 0,
    pending_verifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminDashboard fetching stats...');
    const fetchStats = async () => {
      try {
        const response = await adminApi.getSystemStats();
        console.log('Stats received:', response.data);
        if (response.data) {
          setStats(prev => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Blood Banks', 
      value: stats.blood_banks, 
      icon: Building2, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
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
      label: 'Pending Verifications', 
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
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">System Executive Overview</h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline bg-glass backdrop-blur-md border-glass-border">Export Report</button>
          <button className="btn btn-primary shadow-xl shadow-accent/20">Generate Insights</button>
        </div>
      </header>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="relative group overflow-hidden bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:border-accent/30">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${card.isPositive ? 'text-emerald-500' : 'text-accent'}`}>
                {card.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-text-secondary text-sm font-bold uppercase tracking-widest">{card.label}</h3>
              <p className="text-4xl font-black mt-2 text-white">{card.value}</p>
            </div>

            {/* Decorative background pulse */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${card.bg} blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Activity */}
        <div className="lg:col-span-2 bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <Activity className="text-accent w-6 h-6" />
              Live System Activity
            </h2>
            <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Updates
            </span>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-glass transition-colors group">
                <div className="w-12 h-12 rounded-full bg-glass flex items-center justify-center border border-glass-border group-hover:border-accent/50 transition-colors">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">New Blood Bank Registration</p>
                  <p className="text-sm text-text-secondary">LifeSource Center (Lagos) submitted for verification.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-text-secondary">{item * 5}m ago</p>
                  <button className="text-[10px] uppercase font-black text-accent mt-1 hover:underline">Review Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-xl border border-glass-border rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">SwiftAid Intelligence</h2>
            <p className="text-text-secondary text-sm">Our AI models suggest that blood demand in Lagos state will increase by <span className="text-accent font-bold">15%</span> next week due to seasonal trends.</p>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="bg-glass/50 p-4 rounded-2xl border border-glass-border">
              <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">Optimization Goal</p>
              <p className="text-sm text-white">Reduce delivery time in Port Harcourt.</p>
              <div className="mt-2 w-full bg-bg-dark rounded-full h-1.5">
                <div className="bg-accent h-full rounded-full w-[65%]" />
              </div>
            </div>
            <button className="btn btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest">View Detailed Analysis</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
