import React from 'react';
import { Building2, TrendingUp, DollarSign, Activity } from 'lucide-react';

const FacilityRevenueInsights = ({ stats }) => {
  return (
    <div className="space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-3xl md:rounded-[48px] overflow-hidden shadow-2xl">
        <div className="p-6 md:p-10 border-b border-glass-border bg-glass/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Building2 size={24} className="md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tighter leading-none">Node Performance</h3>
              <p className="text-[8px] md:text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Clinical Financial Intelligence</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="flex-1 md:flex-none px-5 py-3 bg-glass border border-glass-border rounded-2xl flex flex-col items-center md:items-end shadow-sm">
                <span className="text-[8px] font-black uppercase tracking-widest text-text-muted opacity-60">Total Yield</span>
                <span className="text-base md:text-lg font-black text-emerald-500 tracking-tighter tabular-nums">₦{stats?.total_profit?.toLocaleString()}</span>
             </div>
          </div>
        </div>
        
        
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-glass/30 border-b border-glass-border">
              <tr>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Facility Node</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Activity</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Gross (₦)</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted text-right text-emerald-500/80">Net Profit (₦)</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted text-center">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {stats?.revenue_by_facility?.length > 0 ? stats.revenue_by_facility.map((facility) => (
                <tr key={facility.blood_bank__id} className="hover:bg-primary/5 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                        <Building2 size={20} />
                      </div>
                      <span className="font-black text-text-primary text-base uppercase tracking-tight group-hover:text-primary transition-colors">
                        {facility.blood_bank__name}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="font-black text-text-secondary text-base tabular-nums">{facility.request_count}</span>
                    <span className="block text-[8px] font-black uppercase tracking-widest text-text-muted opacity-40">Transactions</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="font-black text-text-primary text-base tabular-nums tracking-tighter">₦{facility.total_revenue?.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="font-black text-emerald-500 text-base tabular-nums tracking-tighter">₦{facility.total_profit?.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                     <div className="inline-flex flex-col items-center gap-1.5">
                        <div className="w-24 h-1.5 bg-glass rounded-full overflow-hidden border border-glass-border shadow-inner">
                           <div 
                             className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" 
                             style={{ width: `${Math.min(((facility.total_profit / (facility.total_revenue || 1)) * 100) * 2, 100)}%` }} 
                           />
                        </div>
                        <span className="text-[10px] font-black text-text-primary tabular-nums">
                          {((facility.total_profit / (facility.total_revenue || 1)) * 100).toFixed(1)}%
                        </span>
                     </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-10 py-24">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                      <div className="p-4 bg-glass border border-glass-border rounded-2xl shadow-inner">
                        <Activity className="w-8 h-8 text-text-muted" />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted">No active nodes detected</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Grid */}
        <div className="md:hidden divide-y divide-glass-border/30">
          {stats?.revenue_by_facility?.length > 0 ? stats.revenue_by_facility.map((facility) => (
            <div key={facility.blood_bank__id} className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Building2 size={20} />
                </div>
                <h4 className="font-black text-text-primary text-base uppercase tracking-tight truncate">{facility.blood_bank__name}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-text-muted opacity-60">Activity</p>
                  <p className="text-sm font-black text-text-primary tabular-nums">{facility.request_count} <span className="text-[8px] opacity-40">TX</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-text-muted opacity-60">Efficiency</p>
                  <p className="text-sm font-black text-primary tabular-nums">{((facility.total_profit / (facility.total_revenue || 1)) * 100).toFixed(1)}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-text-muted opacity-60">Gross Rev</p>
                  <p className="text-sm font-black text-text-primary tabular-nums">₦{facility.total_revenue?.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-text-muted opacity-60">Net Profit</p>
                  <p className="text-sm font-black text-emerald-500 tabular-nums">₦{facility.total_profit?.toLocaleString()}</p>
                </div>
              </div>

              <div className="w-full h-1 bg-glass rounded-full overflow-hidden shadow-inner border border-glass-border">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min(((facility.total_profit / (facility.total_revenue || 1)) * 100) * 2, 100)}%` }} 
                />
              </div>
            </div>
          )) : (
            <div className="py-16 text-center opacity-40">
              <Activity className="mx-auto mb-3" size={32} />
              <p className="text-[9px] font-black uppercase tracking-widest">No node data</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
         <div className="bg-glass/30 border border-glass-border p-5 md:p-8 rounded-3xl md:rounded-[40px] space-y-3 md:space-y-4 shadow-sm group hover:border-primary/30 transition-all">
            <TrendingUp size={24} className="text-primary group-hover:scale-110 transition-transform" />
            <div>
               <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60 mb-1">Peak Performance Node</p>
               <h4 className="text-sm md:text-2xl font-black text-text-primary tracking-tighter uppercase truncate">
                  {stats?.revenue_by_facility?.[0]?.blood_bank__name || 'N/A'}
               </h4>
            </div>
         </div>
         <div className="bg-glass/30 border border-glass-border p-5 md:p-8 rounded-3xl md:rounded-[40px] space-y-3 md:space-y-4 shadow-sm group hover:border-emerald-500/30 transition-all">
            <DollarSign size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            <div>
               <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60 mb-1">Max Revenue Stream</p>
               <h4 className="text-sm md:text-2xl font-black text-text-primary tracking-tighter tabular-nums truncate">
                  ₦{stats?.revenue_by_facility?.reduce((max, f) => Math.max(max, f.total_revenue), 0).toLocaleString()}
               </h4>
            </div>
         </div>
         <div className="col-span-2 lg:col-span-1 bg-glass/30 border border-glass-border p-5 md:p-8 rounded-3xl md:rounded-[40px] space-y-3 md:space-y-4 shadow-sm group hover:border-blue-400/30 transition-all flex flex-col justify-center sm:block">
            <Activity size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <div>
               <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60 mb-1">Network Health Index</p>
               <h4 className="text-sm md:text-2xl font-black text-text-primary tracking-tighter uppercase tabular-nums">
                  {stats?.total_revenue > 0 ? ((stats?.total_profit / stats?.total_revenue) * 100).toFixed(1) : 0}% <span className="text-[10px] opacity-40">System Yield</span>
               </h4>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FacilityRevenueInsights;
