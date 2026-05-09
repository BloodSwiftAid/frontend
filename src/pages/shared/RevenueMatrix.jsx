import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Droplet,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Activity,
  Layers,
  LayoutDashboard,
  Building2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { transactionApi } from '../../api';
import FacilityRevenueMatrix from '../../components/admin/FacilityRevenueMatrix';

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 space-y-6 animate-fade-in">
    <div className="p-6 bg-glass/20 border border-glass-border rounded-[32px] shadow-xl">
      <Icon className="w-10 h-10 text-text-muted opacity-40" />
    </div>
    <div className="text-center max-w-[240px] space-y-2">
      <h4 className="text-sm font-black text-text-primary uppercase tracking-tighter">{title}</h4>
      <p className="text-[10px] text-text-muted font-black uppercase tracking-widest leading-relaxed">{description}</p>
    </div>
  </div>
);

const RevenueMatrix = ({ isAdmin = false }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await transactionApi.getRevenueStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch revenue stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const chartData = stats?.graph_data?.map(item => ({
    name: new Date(item.month).toLocaleDateString('default', { month: 'short' }),
    revenue: item.revenue,
    profit: item.profit,
    pos: item.pos_revenue || 0,
    market: item.market_revenue || 0
  })) || [];

  const typeData = stats?.revenue_by_type?.map(item => ({
    name: item.product__blood_group,
    value: item.amount
  })) || [];

  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Earnings & <span className="text-gradient">Growth</span>
          </h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] opacity-70">
            <Activity className="w-3 h-3 text-accent" />
            Financial Performance Overview
          </p>
        </div>

        {isAdmin && (
          <div className="flex bg-glass p-1.5 rounded-2xl border border-glass-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'overview' 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'text-text-secondary hover:text-text-primary hover:bg-glass'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Network Overview
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'facilities' 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'text-text-secondary hover:text-text-primary hover:bg-glass'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Facility Intelligence
            </button>
          </div>
        )}
      </header>

      {activeTab === 'overview' ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-accent/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-accent/5 min-h-[240px]">
              <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                <DollarSign className="w-40 h-40 text-accent" />
              </div>
              <div className="relative z-10 space-y-6">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Aggregate Revenue</p>
                <h2 className="text-5xl font-black text-text-primary tracking-tighter leading-none">
                  ₦{stats?.total_revenue?.toLocaleString()}
                </h2>
              </div>
              <div className={`relative z-10 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mt-4 ${stats?.revenue_trend >= 0 ? 'text-emerald-500' : 'text-accent'}`}>
                {stats?.revenue_trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stats?.revenue_trend >= 0 ? '+' : ''}{stats?.revenue_trend || 0}% vs Last Period
              </div>
            </div>

            <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-accent/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-accent/5 min-h-[240px]">
              <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                <Calendar className="w-40 h-40 text-accent" />
              </div>
              <div className="relative z-10 space-y-6">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Monthly Cycle</p>
                <h2 className="text-5xl font-black text-text-primary tracking-tighter leading-none">
                  ₦{stats?.monthly_revenue?.toLocaleString() || 0}
                </h2>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest mt-4">
                <TrendingUp className="w-4 h-4" />
                Active Growth Phase
              </div>
            </div>

            {isAdmin && (
              <>
                <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-accent/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-accent/5 min-h-[240px]">
                  <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                    <Layers className="w-40 h-40 text-accent" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Total Earnings</p>
                    <h2 className="text-5xl font-black text-text-primary tracking-tighter leading-none">
                      ₦{stats?.total_profit?.toLocaleString()}
                    </h2>
                  </div>
                  <p className="relative z-10 text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">Commission Accumulation</p>
                </div>

                <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-accent/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-accent/5 min-h-[240px]">
                  <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                    <Activity className="w-40 h-40 text-accent" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Monthly Earnings</p>
                    <h2 className="text-5xl font-black text-text-primary tracking-tighter leading-none">
                      ₦{stats?.monthly_profit?.toLocaleString()}
                    </h2>
                  </div>
                  <p className="relative z-10 text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">Current Month Revenue</p>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Growth Graph */}
            <div className="lg:col-span-2 bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] space-y-8 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">Earnings Growth</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">Monthly Performance Index</p>
                </div>
                <div className="flex gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">Revenue</span>
                   </div>
                   {isAdmin && (
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">Profit</span>
                     </div>
                   )}
                </div>
              </div>
              
              <div className="h-[400px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-text-muted)" strokeOpacity={0.1} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 900}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 900}}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-bg-dark)', 
                          border: '1px solid var(--color-glass-border)',
                          borderRadius: '24px',
                          padding: '20px',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        cursor={{ stroke: 'var(--color-accent)', strokeWidth: 1, strokeDasharray: '5 5' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                      {isAdmin && <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorProf)" />}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={BarChartIcon} title="No Growth Data" description="Insufficient historical transactions to generate growth trajectory." />
                )}
              </div>
            </div>

            {/* Blood Type Distribution */}
            <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] space-y-8 shadow-sm">
               <div>
                  <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">Demand Trends</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">Earnings per Blood Group</p>
               </div>

               <div className="h-[300px] w-full">
                {typeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-bg-dark)', 
                          border: '1px solid var(--color-glass-border)',
                          borderRadius: '24px',
                          backdropFilter: 'blur(20px)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={PieChartIcon} title="No Demand Data" description="Registry distribution is currently balanced or inactive." />
                )}
               </div>

               <div className="grid grid-cols-2 gap-3">
                  {stats?.revenue_by_type?.map((item, index) => (
                    <div key={item.product__blood_group} className="flex justify-between items-center p-4 bg-glass border border-glass-border rounded-2xl hover:border-accent/30 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">{item.product__blood_group}</span>
                       </div>
                       <span className="text-[10px] font-mono text-text-secondary font-black">₦{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] space-y-8 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">Sales Channels</h3>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">Marketplace vs Point of Sale</p>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-text-muted)" strokeOpacity={0.1} vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 900}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 900}} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-bg-dark)', 
                            border: '1px solid var(--color-glass-border)', 
                            borderRadius: '24px',
                            backdropFilter: 'blur(20px)'
                          }} 
                        />
                        <Bar dataKey="market" fill="#ef4444" radius={[12, 12, 0, 0]} name="Marketplace" />
                        <Bar dataKey="pos" fill="#3b82f6" radius={[12, 12, 0, 0]} name="POS" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-center space-y-10 shadow-sm">
                  <div className="text-center space-y-4">
                     <div className="inline-block px-6 py-2 bg-accent/10 border border-accent/20 rounded-full">
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Efficiency Quotient</span>
                     </div>
                     <h2 className="text-7xl font-black text-gradient uppercase tracking-tighter">
                       {stats?.total_revenue > 0 ? ((stats?.total_profit / stats?.total_revenue) * 100).toFixed(1) : 0}%
                     </h2>
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Integrated Network Performance Index</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-8 bg-glass border border-glass-border rounded-[32px] space-y-2 hover:border-accent/30 transition-all group">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:text-accent transition-colors">Marketplace</span>
                        <div className="text-2xl font-black text-text-primary tracking-tight">
                          ₦{chartData.reduce((acc, curr) => acc + curr.market, 0).toLocaleString()}
                        </div>
                     </div>
                     <div className="p-8 bg-glass border border-glass-border rounded-[32px] space-y-2 hover:border-accent/30 transition-all group">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:text-blue-500 transition-colors">POS Direct</span>
                        <div className="text-2xl font-black text-text-primary tracking-tight">
                          ₦{chartData.reduce((acc, curr) => acc + curr.pos, 0).toLocaleString()}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      ) : (
        <FacilityRevenueMatrix stats={stats} />
      )}
    </div>
  );
};

export default RevenueMatrix;

