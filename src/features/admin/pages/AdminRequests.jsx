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
  X,
  Loader2
} from 'lucide-react';
import { transactionApi, adminApi } from '../../../services/api';
import { toast } from 'react-hot-toast';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newBankId, setNewBankId] = useState('');
  const [updating, setUpdating] = useState(false);

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
    setUpdating(true);
    try {
      await transactionApi.updateRequest(selectedRequest.id, { blood_bank: newBankId });
      toast.success("Blood bank assigned successfully");
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      console.error('Coordination update failed:', err);
      toast.error(err.response?.data?.error || "Failed to assign blood bank");
    } finally {
      setUpdating(false);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const totalUnits = requests.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Request <span className="text-primary">Management</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-primary" />
            Live Order Stream
          </p>
        </div>
        <button className="hidden md:flex btn btn-outline border-glass-border px-8 rounded-3xl gap-3 font-black uppercase tracking-widest text-[10px]">
          <Database size={16} /> Export Logs
        </button>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Total Requests', value: requests.length, icon: ArrowLeftRight, color: 'text-primary' },
          { label: 'Pending', value: pendingCount, icon: AlertCircle, color: 'text-accent' },
          { label: 'Units Delivered', value: totalUnits, icon: Droplet, color: 'text-blue-500' },
          { label: 'Health', value: '99.4%', icon: Zap, color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-6 md:p-10 rounded-3xl md:rounded-[48px] flex flex-col justify-between hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm">
            <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 opacity-10 md:opacity-[0.08] pointer-events-none">
              <stat.icon className={`w-16 h-16 md:w-32 md:h-32 ${stat.color}`} />
            </div>
            <div className="relative z-10 space-y-2 md:space-y-6">
              <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none">{stat.value || 0}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-3xl md:rounded-[56px] overflow-hidden shadow-2xl relative">
        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="p-40 flex flex-col items-center gap-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted animate-pulse">Updating Marketplace...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-glass/50 border-b border-glass-border">
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Blood Details</th>
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Hospital</th>
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Assigned Blood Bank</th>
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Status</th>
                  <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/30">
                {requests.map((req) => {
                  const suggested = suggestClosestBank(req);
                  const isPending = req.status === 'PENDING';
                  return (
                    <tr key={req.id} className="hover:bg-primary/5 transition-all group/row">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-glass-border ${isPending ? 'bg-accent/10 border-accent/20' : 'bg-primary/10 border-primary/20'}`}>
                            <Droplet className={`w-7 h-7 ${isPending ? 'text-accent' : 'text-primary'}`} />
                          </div>
                          <div>
                            <p className="text-2xl font-black text-text-primary tracking-tighter uppercase">{req.blood_group}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1">{req.quantity} Units</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-sm font-black text-text-primary uppercase tracking-tight">{req.requester_name || req.patient_name || 'EMERGENCY'}</p>
                        <div className="mt-1 space-y-1">
                          <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-relaxed">
                            {req.requester_hospital_details?.address || req.hospital_location || 'Address Unset'}
                          </p>
                          {req.requester_hospital_details?.contact_phone && (
                            <p className="text-[8px] text-primary font-black uppercase tracking-widest">{req.requester_hospital_details.contact_phone}</p>
                          )}
                          {req.patient_name && req.requester_name && (
                            <p className="text-[8px] text-text-muted/60 font-black uppercase tracking-widest italic">Patient: {req.patient_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        {req.blood_bank ? (
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Allocated</span>
                              <span className="text-xs font-black text-text-primary uppercase tracking-tight opacity-80">{req.blood_bank_details?.name}</span>
                              <p className="text-[8px] text-text-muted font-black uppercase tracking-widest leading-relaxed">{req.blood_bank_details?.address}</p>
                              {req.blood_bank_details?.contact_phone && <p className="text-[8px] text-primary font-black uppercase tracking-widest">{req.blood_bank_details.contact_phone}</p>}
                           </div>
                        ) : (
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black uppercase text-accent tracking-widest animate-pulse">Unassigned</span>
                              {suggested && (
                                <>
                                  <span className="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-40">Target: {suggested.name}</span>
                                  <span className="text-[7px] text-text-muted/30 font-black uppercase tracking-widest">{suggested.address}</span>
                                </>
                              )}
                           </div>
                        )}
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${isPending ? 'bg-accent animate-pulse' : 'bg-emerald-500'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${isPending ? 'text-accent' : 'text-emerald-500'}`}>{req.status}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button onClick={() => { setSelectedRequest(req); setNewBankId(req.blood_bank || suggested?.id || ''); setShowEditModal(true); }} className="p-4 bg-glass border border-glass-border rounded-xl text-accent hover:bg-accent hover:text-white transition-all"><Edit3 size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile View: Card List */}
        <div className="md:hidden p-4 space-y-4">
           {loading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                 <Loader2 className="w-8 h-8 text-primary animate-spin" />
                 <p className="text-[9px] font-black uppercase tracking-widest text-text-muted animate-pulse">Updating orders...</p>
              </div>
           ) : requests.length === 0 ? (
              <div className="py-20 text-center">
                 <p className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-40">No active requests.</p>
              </div>
           ) : (
             requests.map((req) => {
               const suggested = suggestClosestBank(req);
               const isPending = req.status === 'PENDING';
               return (
                 <div key={req.id} className="bg-glass/50 border border-glass-border rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isPending ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                             <Droplet size={20} />
                          </div>
                          <div>
                             <h3 className="text-xl font-black text-text-primary tracking-tighter uppercase">{req.blood_group}</h3>
                             <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">{req.quantity} Units Requested</p>
                          </div>
                       </div>
                       <button onClick={() => { setSelectedRequest(req); setNewBankId(req.blood_bank || suggested?.id || ''); setShowEditModal(true); }} className="p-3 bg-glass border border-glass-border rounded-xl text-accent">
                          <Edit3 size={16} />
                       </button>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-glass-border">
                        <div className="flex flex-col gap-2">
                           <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Requester & Location</span>
                           <div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-text-primary block">{req.requester_name || req.patient_name || 'EMERGENCY REQUEST'}</span>
                             <span className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-60 block leading-relaxed mt-1">{req.requester_hospital_details?.address || req.hospital_location}</span>
                             {req.requester_hospital_details?.contact_phone && <span className="text-[8px] font-black text-primary uppercase tracking-widest mt-1 block">{req.requester_hospital_details.contact_phone}</span>}
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Assigned Blood Bank</span>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${req.blood_bank ? 'text-emerald-500' : 'text-accent'}`}>{req.blood_bank ? req.blood_bank_details?.name : 'UNASSIGNED'}</span>
                           </div>
                          <div className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${isPending ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                             {req.status}
                          </div>
                       </div>
                    </div>
                 </div>
               );
             })
           )}
        </div>
      </div>

      {/* Coordination Override Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-bg-darker/95 backdrop-blur-3xl" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] bg-card-bg border border-glass-border rounded-3xl md:rounded-[64px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-primary" />
            
            <div className="p-8 md:p-16 flex flex-col h-full overflow-y-auto no-scrollbar">
               <div className="flex justify-between items-start mb-8 md:mb-12">
                  <div className="space-y-2">
                     <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg">
                        <span className="text-[8px] font-black text-accent uppercase tracking-widest">Assign Request</span>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black text-text-primary uppercase tracking-tighter leading-none">Assign <span className="text-primary">Blood Bank</span></h2>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="p-4 bg-glass border border-glass-border rounded-2xl text-text-muted hover:text-accent transition-all shrink-0">
                     <X size={24} />
                  </button>
               </div>

               {/* Logistics Details */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 p-8 bg-glass/20 border border-glass-border rounded-[40px]">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Hospital className="w-5 h-5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">Hospital Details</span>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[11px] font-black text-text-primary uppercase tracking-tight">{selectedRequest.requester_name || selectedRequest.patient_name || 'Emergency Request'}</p>
                        <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-relaxed opacity-60">{selectedRequest.requester_hospital_details?.address || selectedRequest.hospital_location || 'Address not logged'}</p>
                        {selectedRequest.requester_hospital_details?.contact_phone && <p className="text-[9px] text-primary font-black uppercase tracking-widest">{selectedRequest.requester_hospital_details.contact_phone}</p>}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">Assigned Blood Bank</span>
                     </div>
                     <div className="space-y-2">
                        {selectedRequest.blood_bank ? (
                           <>
                              <p className="text-[11px] font-black text-text-primary uppercase tracking-tight">{selectedRequest.blood_bank_details?.name}</p>
                              <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-relaxed opacity-60">{selectedRequest.blood_bank_details?.address || 'Address not logged'}</p>
                              {selectedRequest.blood_bank_details?.contact_phone && <p className="text-[9px] text-primary font-black uppercase tracking-widest">{selectedRequest.blood_bank_details.contact_phone}</p>}
                           </>
                        ) : (
                           <p className="text-[9px] text-accent font-black uppercase tracking-widest animate-pulse">Pending Assignment</p>
                        )}
                     </div>
                  </div>
               </div>
              
              <div className="space-y-8 md:space-y-12">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    <div className="p-6 md:p-8 bg-glass border border-glass-border rounded-2xl md:rounded-[32px] space-y-2 md:space-y-3 relative overflow-hidden">
                       <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-muted">Blood Group</p>
                       <p className="text-3xl md:text-4xl font-black text-text-primary">{selectedRequest?.blood_group}</p>
                       <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent">{selectedRequest?.quantity} Units Requested</p>
                    </div>
                    <div className="p-6 md:p-8 bg-glass border border-glass-border rounded-2xl md:rounded-[32px] space-y-2 md:space-y-3 relative overflow-hidden">
                       <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-muted">Patient Info</p>
                        <p className="text-lg md:text-xl font-black text-text-primary uppercase">{selectedRequest?.patient_name || 'EMERGENCY'}</p>
                        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-text-muted opacity-60">{selectedRequest?.hospital_location}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-4">Select Blood Bank to Assign</label>
                   <div className="relative">
                      <select 
                         className="w-full bg-glass border-2 border-glass-border rounded-2xl md:rounded-[32px] py-5 md:py-8 px-6 md:px-10 text-text-primary outline-none focus:border-primary transition-all appearance-none font-black text-base md:text-lg uppercase tracking-tight"
                         value={newBankId}
                         onChange={(e) => setNewBankId(e.target.value)}
                      >
                         <option value="">UNASSIGN BLOOD BANK</option>
                         {bloodBanks.map(bank => (
                         <option key={bank.id} value={bank.id}>{bank.name} // {bank.area}, {bank.state}</option>
                         ))}
                      </select>
                      <ChevronRight className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 text-text-muted/30 rotate-90 pointer-events-none" />
                   </div>
                 </div>

                  <div className="pt-6 md:pt-10 border-t border-glass-border flex flex-col sm:flex-row gap-4 md:gap-6">
                    <button 
                      onClick={handleUpdateBank} 
                      disabled={updating}
                      className="flex-1 btn btn-primary py-5 md:py-8 rounded-2xl md:rounded-[32px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Assign <ShieldCheck size={20} /></>}
                    </button>
                    <button onClick={() => setShowEditModal(false)} disabled={updating} className="sm:w-48 py-5 md:py-8 text-[10px] font-black uppercase tracking-widest text-text-muted border border-glass-border rounded-2xl md:rounded-[32px] bg-glass disabled:opacity-50">Cancel</button>
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
