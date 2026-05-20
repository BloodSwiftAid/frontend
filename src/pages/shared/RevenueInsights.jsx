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
import FacilityRevenueInsights from '../../components/admin/FacilityRevenueInsights';

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

const RevenueInsights = ({ isAdmin = false }) => {
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
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">Revenue <span className="text-primary">Insights</span></h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mt-2 flex items-center gap-2">
            <Activity size={12} className="text-primary" />
            Platform Financial Performance
          </p>
        </div>

        {isAdmin && (
          <div className="flex bg-glass/30 p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-glass-border shadow-xl w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'overview' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-text-secondary'
              }`}
            >
              <LayoutDashboard size={14} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'facilities' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-text-secondary'
              }`}
            >
              <Building2 size={14} />
              Facilities
            </button>
          </div>
        )}
      </header>

      {activeTab === 'overview' ? (
        <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] flex flex-col justify-between hover:border-primary/30 transition-all min-h-[160px] md:min-h-[240px]">
              <div className="space-y-3 md:space-y-6">
                <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Aggregate Revenue</p>
                <h2 className="text-2xl md:text-5xl font-black text-text-primary tracking-tighter leading-none truncate">
                  ₦{stats?.total_revenue?.toLocaleString()}
                </h2>
              </div>
              <div className={`flex items-center gap-1.5 font-black text-[8px] md:text-[10px] uppercase tracking-widest mt-4 ${stats?.revenue_trend >= 0 ? 'text-emerald-500' : 'text-accent'}`}>
                {stats?.revenue_trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stats?.revenue_trend >= 0 ? '+' : ''}{stats?.revenue_trend || 0}%
              </div>
            </div>

            <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] flex flex-col justify-between hover:border-primary/30 transition-all min-h-[160px] md:min-h-[240px]">
              <div className="space-y-3 md:space-y-6">
                <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Monthly Yield</p>
                <h2 className="text-2xl md:text-5xl font-black text-text-primary tracking-tighter leading-none truncate">
                  ₦{stats?.monthly_revenue?.toLocaleString() || 0}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[8px] md:text-[10px] uppercase tracking-widest mt-4">
                <TrendingUp size={14} />
                Active Cycle
              </div>
            </div>

            {isAdmin && (
              <>
                <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] flex flex-col justify-between hover:border-primary/30 transition-all min-h-[160px] md:min-h-[240px]">
                  <div className="space-y-3 md:space-y-6">
                    <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Net Earnings</p>
                    <h2 className="text-2xl md:text-5xl font-black text-text-primary tracking-tighter leading-none truncate">
                      ₦{stats?.total_profit?.toLocaleString()}
                    </h2>
                  </div>
                  <p className="text-[8px] md:text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Verified</p>
                </div>

                <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] flex flex-col justify-between hover:border-primary/30 transition-all min-h-[160px] md:min-h-[240px]">
                  <div className="space-y-3 md:space-y-6">
                    <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Monthly Net</p>
                     <h2 className="text-2xl md:text-5xl font-black text-text-primary tracking-tighter leading-none truncate">
                      ₦{stats?.monthly_profit?.toLocaleString()}
                    </h2>
                  </div>
                  <p className="text-[8px] md:text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Current Period</p>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] space-y-6 md:space-y-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tight">Growth Overview</h3>
                  <p className="text-[8px] md:text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">Historical Performance Index</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-black uppercase tracking-widest text-[8px] md:text-[10px]">Revenue</span>
                   </div>
                   {isAdmin && (
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-black uppercase tracking-widest text-[8px] md:text-[10px]">Net Profit</span>
                     </div>
                   )}
                </div>
              </div>
              
              <div className="h-[250px] md:h-[400px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-text-muted)" strokeOpacity={0.05} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'var(--color-text-secondary)', fontSize: 8, fontWeight: 900}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'var(--color-text-secondary)', fontSize: 8, fontWeight: 900}}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-bg-dark)', 
                          border: '1px solid var(--color-glass-border)',
                          borderRadius: '16px',
                          fontSize: '10px'
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      {isAdmin && <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} fill="none" />}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={BarChartIcon} title="No Analytics" description="Insufficient performance data." />
                )}
              </div>
            </div>

            <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] space-y-6 md:space-y-8">
               <div>
                  <h3 className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tight">Earnings Breakdown</h3>
                  <p className="text-[8px] md:text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">Earnings per Blood Group</p>
               </div>

               <div className="h-[200px] md:h-[250px] w-full">
                {typeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
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
                          borderRadius: '16px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={PieChartIcon} title="No Data" description="Earnings distribution is inactive." />
                )}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stats?.revenue_by_type?.map((item, index) => (
                    <div key={item.product__blood_group} className="flex justify-between items-center p-3 md:p-4 bg-glass border border-glass-border rounded-xl md:rounded-2xl">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <p className="text-[8px] md:text-[9px] font-black uppercase text-text-muted tracking-widest truncate max-w-[50px]">{item.product__blood_group}</p>
                       </div>
                       <span className="text-[9px] md:text-[10px] font-black text-text-primary">₦{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
             <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] space-y-6 md:space-y-8">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tight">Sales Split</h3>
                  <p className="text-[8px] md:text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">Market vs POS</p>
                </div>
                <div className="h-[250px] md:h-[300px] w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-text-muted)" strokeOpacity={0.05} vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-secondary)', fontSize: 8, fontWeight: 900}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-secondary)', fontSize: 8, fontWeight: 900}} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-dark)', border: '1px solid var(--color-glass-border)', borderRadius: '16px' }} />
                        <Bar dataKey="market" fill="#10b981" radius={[8, 8, 0, 0]} name="Market" />
                        <Bar dataKey="pos" fill="#3b82f6" radius={[8, 8, 0, 0]} name="POS" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState icon={BarChartIcon} title="No Split Data" description="Insufficient split performance data." />
                  )}
                </div>
             </div>

             <div className="bg-bg-darker border border-glass-border p-8 md:p-12 rounded-3xl md:rounded-[48px] flex flex-col justify-center space-y-8 md:space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="text-center space-y-3 md:space-y-4 relative z-10">
                   <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full">
                      <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest">
                        {isAdmin ? "Efficiency" : "Marketplace Share"}
                      </span>
                   </div>
                   <h2 className="text-5xl md:text-7xl font-black text-text-primary uppercase tracking-tighter">
                     {isAdmin 
                       ? (stats?.total_revenue > 0 ? ((stats?.total_profit / stats?.total_revenue) * 100).toFixed(1) : 0)
                       : (stats?.total_revenue > 0 ? ((chartData.reduce((acc, curr) => acc + curr.market, 0) / stats?.total_revenue) * 100).toFixed(1) : 0)
                     }%
                   </h2>
                   <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">
                     {isAdmin ? "Performance Index" : "Digital Conversion Index"}
                   </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                   <div className="p-6 md:p-8 bg-glass border border-glass-border rounded-2xl md:rounded-[32px] space-y-2">
                      <span className="text-[8px] md:text-[9px] font-black text-text-muted uppercase tracking-widest">Marketplace</span>
                      <div className="text-lg md:text-2xl font-black text-text-primary tracking-tight">
                        ₦{chartData.reduce((acc, curr) => acc + curr.market, 0).toLocaleString()}
                      </div>
                   </div>
                   <div className="p-6 md:p-8 bg-glass border border-glass-border rounded-2xl md:rounded-[32px] space-y-2">
                      <span className="text-[8px] md:text-[9px] font-black text-text-muted uppercase tracking-widest">Direct POS</span>
                      <div className="text-lg md:text-2xl font-black text-text-primary tracking-tight">
                        ₦{chartData.reduce((acc, curr) => acc + curr.pos, 0).toLocaleString()}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <FacilityRevenueInsights stats={stats} />
      )}
    </div>
  );
};

export default RevenueInsights;
