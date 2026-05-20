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
  AlertCircle,
  Wallet
} from 'lucide-react';
import { paymentApi, adminApi, usersApi } from '../../api';
import { useIsVerified } from '../../hooks/useIsVerified';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const BloodBankPayouts = () => {
  const isVerified = useIsVerified();
  const [payouts, setPayouts] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [globalConfig, setGlobalConfig] = useState(null);
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
      const [payoutsRes, banksRes, configRes, meRes] = await Promise.all([
        paymentApi.listPayouts(),
        paymentApi.listBankDetails(),
        adminApi.getGlobalConfig(),
        usersApi.getMe()
      ]);
      
      setPayouts(Array.isArray(payoutsRes.data) ? payoutsRes.data : (payoutsRes.data.results || []));
      setBankDetails(Array.isArray(banksRes.data) ? banksRes.data : (banksRes.data.results || []));
      setGlobalConfig(configRes.data);
      setWalletBalance(meRes.data.profile_details?.blood_bank_details?.wallet_balance || 0);
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error("Failed to sync financial data");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error("Facility verification required for payout");
      return;
    }
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
      toast.success("Payout request submitted successfully");
      setShowModal(false);
      setPayoutAmount('');
      fetchInitialData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Payout request failed");
    } finally {
      setProcessing(false);
    }
  };

  // Calculate free payouts left
  const now = new Date();
  const payoutsThisMonth = payouts.filter(p => {
    const d = new Date(p.date_created);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && p.status !== 'FAILED';
  }).length;
  const freeLeft = Math.max(0, (globalConfig?.allowed_free_payouts || 0) - payoutsThisMonth);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Revenue <span className="text-gradient">Withdrawal</span>
          </h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px] opacity-70">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Secure Settlement | Facility Treasury
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/bloodbank/payouts/banks"
            className="flex items-center gap-3 bg-glass border border-glass-border px-6 py-4 rounded-2xl hover:border-accent/40 transition-all group"
          >
            <Building2 className="w-4 h-4 text-text-muted group-hover:text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">Payout Accounts</span>
          </Link>
          
          <button 
            onClick={() => isVerified ? setShowModal(true) : toast.error('Verification Required')}
            disabled={!isVerified}
            className={`flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-accent/20 ${!isVerified ? 'opacity-40 grayscale cursor-not-allowed shadow-none' : 'hover:scale-105'}`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{isVerified ? 'Initiate Payout' : 'Payout Restricted'}</span>
          </button>
        </div>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card-bg/40 backdrop-blur-xl border border-accent/20 p-8 rounded-[40px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="w-16 h-16 text-accent" />
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-2">Available Balance</p>
          <h4 className="text-4xl font-black text-text-primary tracking-tighter">₦{parseFloat(walletBalance).toLocaleString()}</h4>
        </div>
        
        <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-2">Total Withdrawn</p>
          <h4 className="text-4xl font-black text-emerald-500 tracking-tighter">
            ₦{payouts.filter(p => p.status === 'SUCCESS').reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString()}
          </h4>
        </div>

        <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Clock className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-2">Pending Payout</p>
          <h4 className="text-4xl font-black text-blue-500 tracking-tighter">
             ₦{payouts.filter(p => p.status === 'PENDING').reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString()}
          </h4>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[48px] overflow-hidden flex flex-col shadow-2xl">
         <div className="p-10 border-b border-glass-border flex justify-between items-center bg-glass/20">
          <div>
            <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Payout History</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Disbursement update logs</p>
          </div>
          <button className="p-3 bg-glass border border-glass-border rounded-xl hover:bg-accent/10 transition-all text-text-muted hover:text-accent">
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
           <table className="w-full text-left">
            <thead>
              <tr className="bg-glass/50 border-b border-glass-border">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Identifier</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Gross Amount</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Fee</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-text-secondary">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/20">
              {payouts.length > 0 ? payouts.map((payout, i) => (
                <tr key={i} className="hover:bg-accent/5 transition-all">
                  <td className="px-10 py-8">
                     <p className="text-sm font-black text-text-primary uppercase tracking-tight">
                       {payout.bank_detail_details?.bank_name || 'Transfer'}
                     </p>
                     <p className="font-mono text-[9px] text-text-muted mt-1 uppercase">Ref: {payout.transaction_reference}</p>
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
                    {new Date(payout.date_created).toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center opacity-40">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">No settlements recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
           </table>
        </div>
      </div>

      {/* Payout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-xl bg-bg-dark/80 animate-fade-in">
          <div className="bg-card-bg border border-glass-border w-full max-w-xl rounded-[56px] p-12 shadow-2xl relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            
            <header className="mb-12">
              <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Initiate Payout</h2>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Authorize withdrawal of earnings</p>
            </header>

            <form onSubmit={handleRequestPayout} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Select Payout Account</label>
                <select 
                  required
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full bg-bg-darker border-2 border-glass-border rounded-2xl px-6 py-4 text-sm font-bold text-text-primary focus:border-accent outline-none appearance-none"
                >
                  <option value="">Select Account</option>
                  {bankDetails.map(b => <option key={b.id} value={b.id}>{b.bank_name} - {b.account_number}</option>)}
                </select>
                {bankDetails.length === 0 && (
                  <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-4">
                    * No accounts configured. <Link to="/bloodbank/payouts/banks" className="underline">Setup account</Link>
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted font-black">₦</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full bg-bg-darker border-2 border-glass-border rounded-2xl pl-12 pr-8 py-5 text-2xl font-black text-text-primary focus:border-accent outline-none"
                  />
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                    Available: <span className="text-text-primary">₦{parseFloat(walletBalance).toLocaleString()}</span>
                  </p>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${freeLeft > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                    {freeLeft > 0 ? `${freeLeft} Free Left` : `Fee: ₦${globalConfig?.payout_charge_fee}`}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={processing || !bankDetails.length || parseFloat(payoutAmount) < 1000}
                  className="flex-1 bg-accent text-white font-black py-6 rounded-2xl uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 disabled:grayscale disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Request Payout"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-10 bg-glass border border-glass-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-red-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
               <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
               <p className="text-[9px] font-black text-text-secondary uppercase leading-relaxed opacity-80">
                 Payout requests are processed via Paystack. Funds will be deducted from your wallet immediately upon initiation. 
                 {freeLeft === 0 && ` A flat fee of ₦${globalConfig?.payout_charge_fee} applies as you have exhausted your monthly free quota.`}
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankPayouts;
