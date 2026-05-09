import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  MapPin, 
  Droplet, 
  Hospital, 
  CheckCircle2, 
  AlertCircle, 
  Edit3,
  Search,
  Filter,
  ArrowRight,
  Activity,
  Zap,
  ShieldCheck,
  ChevronRight,
  Database,
  Clock,
  X
} from 'lucide-react';
import { transactionApi, adminApi } from '../../api';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newBankId, setNewBankId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, bankRes] = await Promise.all([
        transactionApi.listRequests(),
        adminApi.listBloodBanks()
      ]);
      setRequests(reqRes.data.results || reqRes.data);
      setBloodBanks(bankRes.data.results || bankRes.data);
    } catch (err) {
      console.error('Data sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const suggestClosestBank = (request) => {
    const location = request.hospital_location?.toLowerCase() || '';
    const stateMatch = bloodBanks.filter(b => request.requester_hospital_state?.toLowerCase() === b.state?.toLowerCase());
    const areaMatch = stateMatch.filter(b => location.includes(b.area?.toLowerCase()));
    
    return areaMatch[0] || stateMatch[0] || bloodBanks[0];
  };

  const handleUpdateBank = async () => {
    try {
      await transactionApi.updateRequest(selectedRequest.id, { blood_bank: newBankId });
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      console.error('Coordination update failed:', err);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const totalUnits = requests.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Request <span className="text-gradient">Management</span>
          </h1>
          <p className="text-text-secondary flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
            <Activity className="w-3.5 h-3.5 text-accent" />
            Live Order Stream
          </p>
        </div>
        <div className="flex gap-4">
           <button className="btn btn-outline bg-glass border-glass-border px-8 rounded-3xl gap-4 font-black uppercase tracking-widest text-[10px]">
              <Database className="w-4 h-4" />
              Export Logs
           </button>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Requests', value: requests.length, icon: ArrowLeftRight, color: 'text-primary' },
            { label: 'Pending', value: pendingCount, icon: AlertCircle, color: 'text-accent' },
            { label: 'Units Delivered', value: `${totalUnits}`, icon: Droplet, color: 'text-blue-500' },
            { label: 'Network Health', value: '99.4%', icon: Zap, color: 'text-emerald-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-10 rounded-[48px] flex flex-col justify-between hover:border-accent/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-accent/5 min-h-[220px]">
              <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                <stat.icon className={`w-32 h-32 ${stat.color}`} />
              </div>
              <div className="relative z-10 space-y-6">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">{stat.label}</p>
                <h4 className="text-5xl font-black text-text-primary tracking-tighter leading-none">{stat.value || 0}</h4>
              </div>
            </div>
          ))}
      </div>

      <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[56px] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="p-40 flex flex-col items-center gap-8">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
                <Activity className="absolute inset-0 m-auto w-10 h-10 text-accent animate-pulse" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Synchronizing Marketplace Overview...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-glass/50 border-b border-glass-border">
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Asset Specification</th>
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Target Endpoint</th>
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Assigned Node</th>
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Coordination Status</th>
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/30">
                {requests.map((req) => {
                  const suggested = suggestClosestBank(req);
                  const isPending = req.status === 'PENDING';
                  
                  return (
                    <tr key={req.id} className="hover:bg-accent/5 transition-all group/row">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border border-glass-border shadow-xl shadow-black/5 transition-transform duration-500 group-hover/row:scale-110 group-hover/row:-rotate-3 ${isPending ? 'bg-accent/10' : 'bg-primary/10'}`}>
                            <Droplet className={`w-8 h-8 ${isPending ? 'text-accent' : 'text-primary'}`} />
                          </div>
                          <div>
                            <p className="text-3xl font-black text-text-primary tracking-tighter group-hover/row:text-accent transition-colors">{req.blood_group}</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60 flex items-center gap-2 mt-1">
                               <Clock className="w-3 h-3" />
                               {req.quantity} Units Requested
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-1.5">
                           <p className="text-sm font-black text-text-primary uppercase tracking-tight">{req.patient_name || 'EMERGENCY PROTOCOL'}</p>
                           <div className="flex items-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">
                              <MapPin className="w-3 h-3 text-primary" />
                              <span className="truncate max-w-[180px]">{req.hospital_location}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        {req.blood_bank ? (
                          <div className="space-y-2">
                             <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Committed</span>
                             </div>
                             <p className="text-xs font-black text-text-primary uppercase tracking-tight opacity-80">{req.blood_bank_details?.name}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                             <div className="inline-flex items-center gap-3 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full animate-pulse shadow-sm">
                                <AlertCircle className="w-3.5 h-3.5 text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Unassigned</span>
                             </div>
                             {suggested && (
                               <div className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-widest opacity-40">
                                  <ArrowRight className="w-3 h-3" />
                                  Target: {suggested.name}
                               </div>
                             )}
                          </div>
                        )}
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <div className={`w-2.5 h-2.5 rounded-full ${isPending ? 'bg-accent animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPending ? 'text-accent' : 'text-emerald-500'}`}>
                             {req.status}
                           </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => {
                            setSelectedRequest(req);
                            setNewBankId(req.blood_bank || suggested?.id || '');
                            setShowEditModal(true);
                          }}
                          className="p-5 bg-glass border border-glass-border hover:bg-accent/10 rounded-2xl transition-all text-accent shadow-xl hover:shadow-accent/20 group/btn"
                        >
                          <Edit3 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Coordination Override Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-bg-darker/95 backdrop-blur-3xl" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-2xl bg-card-bg border border-glass-border rounded-[64px] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary" />
            
            <div className="p-12 md:p-16 space-y-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                     <div className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Logistics Override</span>
                     </div>
                     <h2 className="text-5xl font-black text-text-primary uppercase tracking-tighter leading-none">Order <span className="text-gradient">Coordination</span></h2>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="p-4 bg-glass border border-glass-border rounded-2xl text-text-muted hover:text-accent transition-all">
                     <X className="w-6 h-6" />
                  </button>
               </div>
              
              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                   <div className="p-8 bg-glass border border-glass-border rounded-[32px] space-y-3 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                         <Droplet className="w-16 h-16 text-accent" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Asset Type</p>
                      <p className="text-4xl font-black text-text-primary">{selectedRequest?.blood_group}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">{selectedRequest?.quantity} Units Requested</p>
                   </div>
                   <div className="p-8 bg-glass border border-glass-border rounded-[32px] space-y-3 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                         <Hospital className="w-16 h-16 text-primary" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Target Node</p>
                      <p className="text-xl font-black text-text-primary uppercase leading-none truncate">{selectedRequest?.patient_name || 'EMERGENCY'}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-60 truncate">{selectedRequest?.hospital_location}</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-4">Fulfillment Node Assignment</label>
                  <div className="relative group">
                     <select 
                        className="w-full bg-glass border-2 border-glass-border rounded-[32px] py-8 px-10 text-text-primary outline-none focus:border-accent transition-all appearance-none font-black text-lg uppercase tracking-tight shadow-inner"
                        value={newBankId}
                        onChange={(e) => setNewBankId(e.target.value)}
                     >
                        <option value="">DE-COUPLE fulfillment NODE</option>
                        {bloodBanks.map(bank => (
                        <option key={bank.id} value={bank.id}>{bank.name} // {bank.area}, {bank.state}</option>
                        ))}
                     </select>
                     <ChevronRight className="absolute right-10 top-1/2 -translate-y-1/2 w-8 h-8 text-text-muted/30 group-focus-within:rotate-90 transition-transform pointer-events-none" />
                  </div>
                </div>

                <div className="pt-8 border-t border-glass-border flex flex-col md:flex-row gap-6">
                  <button 
                    onClick={handleUpdateBank}
                    className="flex-1 btn btn-primary py-8 rounded-[32px] shadow-2xl shadow-accent/40 font-black uppercase tracking-[0.4em] text-xs bg-accent border-none flex items-center justify-center gap-4 group"
                  >
                    <span>Commit Assignment Protocol</span>
                    <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="md:w-48 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-all border border-glass-border rounded-[32px] bg-glass"
                  >
                    Abort Override
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
