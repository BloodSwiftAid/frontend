import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  DollarSign,
  ShieldCheck,
  History,
  Download,
  Plus,
  ArrowUpRight,
  Building2,
  AlertCircle
} from 'lucide-react';
import { paymentApi, adminApi } from '../../api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Payout Form
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [payoutsRes, banksRes, statsRes] = await Promise.all([
        paymentApi.listPayouts(),
        paymentApi.listBankDetails(),
        adminApi.getSystemStats()
      ]);
      
      setPayouts(Array.isArray(payoutsRes.data) ? payoutsRes.data : (payoutsRes.data.results || []));
      setBankDetails(Array.isArray(banksRes.data) ? banksRes.data : (banksRes.data.results || []));
      setWalletBalance(statsRes.data.platform_wallet || 0);
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error("Failed to sync financial data");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!payoutAmount || !selectedBankId) {
      toast.error("Please select a bank and enter amount");
      return;
    }

    setProcessing(true);
    try {
      await paymentApi.createPayout({
        amount: payoutAmount,
        bank_detail_id: selectedBankId
      });
      toast.success("Platform payout initiated successfully");
      setShowModal(false);
      setPayoutAmount('');
      fetchInitialData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Payout authorization failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Settlement <span className="text-primary">Hub</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Payout Directory
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 md:gap-4">
          <Link 
            to="/admin/payouts/banks"
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-glass border border-glass-border px-6 py-4 rounded-xl md:rounded-2xl hover:border-primary/40 transition-all group"
          >
            <Building2 size={16} className="text-text-muted group-hover:text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">Accounts</span>
          </Link>
          
          <button 
            onClick={() => setShowModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl md:rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <ArrowUpRight size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Request Payout</span>
          </button>
        </div>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
        {[
          { label: 'Commission Balance', value: walletBalance, icon: DollarSign, color: 'text-primary' },
          { label: 'Total Disbursed', value: payouts.filter(p => p.status === 'SUCCESS').reduce((acc, curr) => acc + parseFloat(curr.amount), 0), icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Pending Payout', value: payouts.filter(p => p.status === 'PENDING').reduce((acc, curr) => acc + parseFloat(curr.amount), 0), icon: Clock, color: 'text-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-8 rounded-3xl md:rounded-[40px] relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 md:-top-2 md:-right-2 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <stat.icon className={`w-12 h-12 md:w-16 md:h-16 ${stat.color}`} />
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 md:mb-2">{stat.label}</p>
            <h4 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter truncate">₦{parseFloat(stat.value).toLocaleString()}</h4>
          </div>
        ))}
      </div>

      {/* Global History Registry */}
      <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-3xl md:rounded-[48px] overflow-hidden flex flex-col shadow-2xl">
         <div className="p-6 md:p-10 border-b border-glass-border flex justify-between items-center bg-glass/20">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Payout History</h2>
            <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mt-1 md:mt-2">Cross-facility overview</p>
          </div>
          <button className="p-3 bg-glass border border-glass-border rounded-xl text-text-muted">
            <Download size={18} />
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
           <table className="w-full text-left">
            <thead>
              <tr className="bg-glass/50 border-b border-glass-border">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Beneficiary Entity</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Amount (₦)</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Fee</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/20">
              {payouts.length > 0 ? payouts.map((payout, i) => (
                <tr key={i} className="hover:bg-primary/5 transition-all">
                  <td className="px-10 py-8">
                     <p className="text-sm font-black text-text-primary uppercase tracking-tight">
                       {payout.is_internal_admin ? 'Treasury (Platform)' : (payout.blood_bank_name || 'Network Node')}
                     </p>
                     <p className="font-mono text-[9px] text-text-muted mt-1 uppercase truncate max-w-[150px]">Ref: {payout.transaction_reference}</p>
                  </td>
                  <td className="px-10 py-8">
                     <p className="text-xl font-black text-text-primary tracking-tighter">₦{parseFloat(payout.amount).toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-8">
                     <span className={`text-[11px] font-black uppercase tracking-widest ${parseFloat(payout.fee) > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {parseFloat(payout.fee) > 0 ? `₦${payout.fee}` : 'FREE'}
                     </span>
                  </td>
                  <td className="px-10 py-8">
                     <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                       payout.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                       payout.status === 'PENDING' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse' :
                       'bg-red-500/10 text-red-500 border border-red-500/20'
                     }`}>
                       {payout.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : 
                        payout.status === 'PENDING' ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                       {payout.status}
                     </span>
                  </td>
                  <td className="px-10 py-8 text-text-secondary text-[11px] font-bold uppercase">
                    {new Date(payout.date_created).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center opacity-40">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">No cross-grid settlements recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
           </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden p-4 space-y-4">
           {payouts.length > 0 ? payouts.map((payout, i) => (
              <div key={i} className="bg-glass/50 border border-glass-border rounded-2xl p-5 space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="min-w-0">
                       <p 
                          className="font-black text-text-primary uppercase tracking-tight"
                          style={{ 
                            fontSize: (payout.is_internal_admin ? 'Treasury (Platform)' : (payout.blood_bank_name || 'Network Node')).length > 20 ? '0.875rem' : '1rem' 
                          }}
                       >
                          {payout.is_internal_admin ? 'Treasury (Platform)' : (payout.blood_bank_name || 'Network Node')}
                       </p>
                       <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mt-1">Ref: {payout.transaction_reference}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                       payout.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' :
                       payout.status === 'PENDING' ? 'bg-blue-500/10 text-blue-500 animate-pulse' :
                       'bg-red-500/10 text-red-500'
                    }`}>
                       {payout.status}
                    </span>
                 </div>
                 
                 <div className="flex justify-between items-end pt-4 border-t border-glass-border">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Amount</span>
                       <span className="text-xl font-black text-text-primary tracking-tighter">₦{parseFloat(payout.amount).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Fee: {parseFloat(payout.fee) > 0 ? `₦${payout.fee}` : 'Free'}</span>
                       <p className="text-[8px] font-black uppercase tracking-widest text-text-secondary mt-1">{new Date(payout.date_created).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
           )) : (
              <div className="py-20 text-center opacity-40">
                 <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">No settlements recorded</p>
              </div>
           )}
        </div>
      </div>

      {/* Payout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-bg-dark/80 backdrop-blur-xl animate-fade-in overflow-hidden">
          <div className="bg-card-bg border border-glass-border w-full max-w-xl max-h-[90vh] rounded-3xl md:rounded-[56px] p-8 md:p-12 shadow-2xl relative overflow-y-auto no-scrollbar animate-slide-up">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            
            <header className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Request Payout</h2>
              <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Submit a payout request to your bank account</p>
            </header>

            <form onSubmit={handleRequestPayout} className="space-y-6 md:space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Target Payout Account</label>
                <select 
                  required
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full bg-bg-darker border-2 border-glass-border rounded-xl md:rounded-2xl px-6 py-4 text-[11px] md:text-sm font-bold text-text-primary focus:border-primary outline-none appearance-none"
                >
                  <option value="">Select Platform Account</option>
                  {bankDetails.map(b => <option key={b.id} value={b.id}>{b.bank_name} - {b.account_number}</option>)}
                </select>
                {bankDetails.length === 0 && (
                  <p className="text-red-500 text-[8px] font-black uppercase tracking-widest ml-4">
                    * No accounts configured. <Link to="/admin/payouts/banks" className="underline">Configure here</Link>
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Amount</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted font-black">₦</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full bg-bg-darker border-2 border-glass-border rounded-xl md:rounded-2xl pl-12 pr-6 py-4 md:py-5 text-xl md:text-2xl font-black text-text-primary focus:border-primary outline-none"
                  />
                </div>
                <div className="flex justify-between px-4 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-text-muted">
                  <span>Available Balance</span>
                  <span className="text-primary">₦{parseFloat(walletBalance).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={processing || !bankDetails.length || parseFloat(payoutAmount) < 1000}
                  className="flex-1 bg-primary text-white font-black py-5 md:py-6 rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 disabled:grayscale disabled:opacity-50 flex items-center justify-center"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Payout Request"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="sm:w-32 bg-glass border border-glass-border rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted py-5"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-8 p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-4">
               <AlertCircle size={18} className="text-amber-500 shrink-0" />
               <p className="text-[8px] font-black text-text-secondary uppercase leading-relaxed opacity-80">
                 Immediate transfer via Paystack payment gateway. 
                 Completed once processed by bank.
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayouts;
