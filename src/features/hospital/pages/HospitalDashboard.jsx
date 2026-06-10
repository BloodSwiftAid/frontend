import React, { useState, useEffect } from 'react';
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
  Heart,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { transactionApi, usersApi } from '../../../services/api';
import { useIsVerified } from '../../../shared/hooks/useIsVerified';
import { toast } from 'react-hot-toast';

const RequestHistory = ({ data }) => (
  <div className="overflow-hidden border border-glass-border rounded-[32px] bg-card-bg/40 backdrop-blur-xl">
    <table className="w-full text-left text-sm">
      <thead className="bg-glass/50 border-b border-glass-border">
        <tr>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Request ID</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Type</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Quantity</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Status</th>
          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-glass-border/30">
        {data?.length > 0 ? data.slice(0, 5).map((item, i) => (
          <tr key={i} className="hover:bg-accent/5 transition-all group">
            <td className="px-8 py-6 font-mono text-text-muted font-bold text-xs">#{item.id}</td>
            <td className="px-8 py-6">
              <div className="flex flex-col">
                <span className="font-black text-text-primary text-lg">{item.blood_group || 'N/A'}</span>
                {item.batch_id && (
                  <span className="text-[7px] font-mono text-blue-500/40 font-black uppercase tracking-tighter">Batch: {item.batch_id.slice(0, 8)}</span>
                )}
              </div>
            </td>
            <td className="px-8 py-6 font-black text-text-primary">{item.quantity} Units</td>
            <td className="px-8 py-6">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                item.status === 'PENDING' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              }`}>
                {item.status}
              </span>
            </td>
            <td className="px-8 py-6 text-right">
              <Link to="/hospital/transactions" className="text-accent font-black text-[10px] uppercase tracking-widest hover:underline">View Details</Link>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="5" className="px-8 py-24">
              <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                <div className="p-4 bg-glass border border-glass-border rounded-2xl">
                  <Clock className="w-8 h-8 text-text-muted" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">No active requests</p>
                </div>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const HospitalDashboard = () => {
  const isVerified = useIsVerified();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, meRes] = await Promise.all([
          transactionApi.getRequests(),
          usersApi.getMe()
        ]);
        // Handle paginated or non-paginated responses
        const requestsData = Array.isArray(reqRes.data) ? reqRes.data : (reqRes.data.results || []);
        setRequests(requestsData);
        setProfile(meRes.data.profile_details);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setRequests([]); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">Hospital <span className="text-gradient">Dashboard</span></h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] opacity-70">
            <HospitalIcon className="w-3 h-3 text-blue-500" />
            {profile?.hospital_details?.name || 'Active Facility'} | Operational
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            to={isVerified ? "/hospital/marketplace" : "#"} 
            onClick={(e) => !isVerified && (e.preventDefault(), toast.error('Verification required'))}
            className={`btn btn-primary px-8 py-4 rounded-2xl shadow-xl gap-3 group transition-all ${!isVerified ? 'opacity-40 grayscale cursor-not-allowed shadow-none' : 'shadow-accent/20'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold tracking-tight uppercase tracking-widest text-[11px]">{isVerified ? 'Order Blood' : 'Order Restricted'}</span>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-accent/30 transition-all duration-700 relative overflow-hidden min-h-[220px]">
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
            <Clock className="w-32 h-32 text-accent" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Operational Status</p>
            <h4 className="text-5xl font-black text-text-primary tracking-tighter leading-none uppercase">Online</h4>
          </div>
        </div>

        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-700 relative overflow-hidden min-h-[220px]">
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
            <Heart className="w-32 h-32 text-emerald-500" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Total Procured</p>
            <h4 className="text-5xl font-black text-text-primary tracking-tighter leading-none">
              {requests
                .filter(r => ['APPROVED', 'DISPATCHED', 'DELIVERED'].includes(r.status))
                .reduce((acc, curr) => acc + (curr.quantity || 0), 0)}
            </h4>
          </div>
        </div>

        <div className="group bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-blue-500/30 transition-all duration-700 relative overflow-hidden min-h-[220px]">
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
            <Droplet className="w-32 h-32 text-blue-500" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Active Orders</p>
            <h4 className="text-5xl font-black text-text-primary tracking-tighter leading-none">
              {requests.filter(r => r.status === 'PENDING' || r.status === 'DISPATCHED').length}
            </h4>
          </div>
        </div>
      </div>

      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-text-primary tracking-tighter uppercase">Request Timeline</h2>
            <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest">Active and historical procurement logs</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <Link to="/hospital/transactions" className="btn btn-outline px-8 rounded-2xl gap-3">
              <Filter className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-[10px]">View All History</span>
            </Link>
          </div>
        </div>
        
        <RequestHistory data={requests} />
      </div>
    </div>
  );
};

export default HospitalDashboard;
