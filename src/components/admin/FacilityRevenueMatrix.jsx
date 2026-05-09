import React from 'react';
import { Building2, TrendingUp, DollarSign, Activity } from 'lucide-react';

const FacilityRevenueMatrix = ({ stats }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-glass-border bg-glass/20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter italic">Blood Bank Earnings</h3>
              <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">Network financial performance overview</p>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="px-6 py-3 bg-glass border border-glass-border rounded-2xl flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Network Yield</span>
                <span className="text-lg font-black text-emerald-500 tracking-tighter">₦{stats?.total_profit?.toLocaleString()}</span>
             </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-glass/30 border-b border-glass-border">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Facility Name</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Throughput</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Gross Intake (₦)</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right text-emerald-500/80">System Profit (₦)</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-center">Efficiency %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {stats?.revenue_by_facility?.length > 0 ? stats.revenue_by_facility.map((facility) => (
                <tr key={facility.blood_bank__id} className="hover:bg-accent/5 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="font-black text-text-primary text-lg uppercase tracking-tight italic group-hover:text-accent transition-colors">
                        {facility.blood_bank__name}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="font-black text-text-secondary text-base tabular-nums">{facility.request_count}</span>
                    <span className="block text-[8px] font-black uppercase tracking-widest text-text-muted opacity-40">Orders</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="font-black text-text-primary text-lg tabular-nums tracking-tighter">₦{facility.total_revenue?.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="font-black text-emerald-500 text-lg tabular-nums tracking-tighter">₦{facility.total_profit?.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                     <div className="inline-flex flex-col items-center gap-1">
                        <div className="w-24 h-1.5 bg-glass rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-accent shadow-[0_0_8px_rgba(255,51,102,0.4)]" 
                             style={{ width: `${Math.min(((facility.total_profit / facility.total_revenue) * 100) * 2, 100)}%` }} 
                           />
                        </div>
                        <span className="text-[10px] font-black text-text-primary tabular-nums">
                          {((facility.total_profit / facility.total_revenue) * 100).toFixed(1)}%
                        </span>
                     </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-10 py-24">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                      <div className="p-4 bg-glass border border-glass-border rounded-2xl">
                        <Activity className="w-8 h-8 text-text-muted" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">No active facility nodes detected in financial grid</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-glass border border-glass-border p-8 rounded-[40px] space-y-4">
            <TrendingUp className="w-8 h-8 text-accent" />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Peak Node Performance</p>
            <h4 className="text-2xl font-black text-text-primary tracking-tighter uppercase italic">
               {stats?.revenue_by_facility?.[0]?.blood_bank__name || 'N/A'}
            </h4>
         </div>
         <div className="bg-glass border border-glass-border p-8 rounded-[40px] space-y-4">
            <DollarSign className="w-8 h-8 text-emerald-500" />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Top Revenue Driver</p>
            <h4 className="text-2xl font-black text-text-primary tracking-tighter uppercase italic">
               ₦{stats?.revenue_by_facility?.reduce((max, f) => Math.max(max, f.total_revenue), 0).toLocaleString()}
            </h4>
         </div>
         <div className="bg-glass border border-glass-border p-8 rounded-[40px] space-y-4">
            <Activity className="w-8 h-8 text-blue-500" />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Network Efficiency</p>
            <h4 className="text-2xl font-black text-text-primary tracking-tighter uppercase italic">
               {stats?.total_revenue > 0 ? ((stats?.total_profit / stats?.total_revenue) * 100).toFixed(1) : 0}% Avg
            </h4>
         </div>
      </div>
    </div>
  );
};

export default FacilityRevenueMatrix;
