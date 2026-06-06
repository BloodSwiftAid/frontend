import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Fingerprint
} from 'lucide-react';
import { paymentApi } from '../../../services/api';
import { useIsVerified } from '../../../shared/hooks/useIsVerified';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const BloodBankBankDetails = () => {
  const isVerified = useIsVerified();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  
  const [availableBanks, setAvailableBanks] = useState([]);
  const [newBank, setNewBank] = useState({
    account_number: '',
    account_name: '',
    bank_code: '',
    bank_name: ''
  });

  useEffect(() => {
    fetchData();
    fetchPaystackBanks();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.listBankDetails();
      setBanks(Array.isArray(res.data) ? res.data : (res.data.results || []));
    } catch (error) {
      toast.error("Failed to load payout accounts");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaystackBanks = async () => {
    try {
      const res = await fetch('https://api.paystack.co/bank');
      const data = await res.json();
      if (data.status) setAvailableBanks(data.data);
    } catch (error) {
      console.error("Failed to load bank list");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error("Verification required to register payout accounts");
      return;
    }
    setProcessing(true);
    try {
      await paymentApi.createBankDetail(newBank);
      toast.success("Payout account registered successfully");
      setShowAdd(false);
      setNewBank({ account_number: '', account_name: '', bank_code: '', bank_name: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Account verification failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isVerified) return;
    if (!window.confirm("Permanently remove this payout account?")) return;
    try {
      await paymentApi.deleteBankDetail(id);
      toast.success("Account removed");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove account");
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
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <Link to="/bloodbank/payouts" className="p-4 bg-glass border border-glass-border rounded-2xl hover:text-accent transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
              Payout <span className="text-gradient">Accounts</span>
            </h1>
            <p className="text-text-secondary mt-2 flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px] opacity-70">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Facility Settlement Node Configuration
            </p>
          </div>
        </div>
        
        {banks.length < 3 && (
          <button 
            onClick={() => isVerified ? setShowAdd(true) : toast.error('Verification Required')}
            disabled={!isVerified}
            className={`flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-accent/20 ${!isVerified ? 'opacity-40 grayscale cursor-not-allowed shadow-none' : 'hover:scale-105'}`}
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{isVerified ? 'Register Account' : 'Action Restricted'}</span>
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[48px] p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">Payout Accounts</h3>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-glass px-4 py-1.5 rounded-full border border-glass-border">
                  {banks.length} / 3 Slots
                </span>
              </div>

              <div className="space-y-6">
                {banks.length > 0 ? banks.map((bank) => (
                  <div key={bank.id} className="p-8 bg-glass/20 border border-glass-border rounded-[32px] flex justify-between items-center group hover:border-accent/40 transition-all relative overflow-hidden">
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
                        <Building2 className="w-8 h-8 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-text-primary tracking-tight uppercase">{bank.bank_name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm font-mono text-text-muted font-bold tracking-widest">{bank.account_number}</p>
                          <span className="w-1 h-1 rounded-full bg-text-muted opacity-30" />
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </p>
                        </div>
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-3 opacity-60">{bank.account_name}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(bank.id)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl shadow-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all" />
                  </div>
                )) : (
                  <div className="py-24 text-center border-2 border-dashed border-glass-border rounded-[32px] opacity-40">
                     <AlertCircle className="w-12 h-12 mx-auto mb-6 text-text-muted" />
                     <p className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted">No payout accounts configured</p>
                  </div>
                )}
              </div>
           </div>
        </div>

        <div className={`space-y-8 transition-all duration-500 ${showAdd ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}>
          {showAdd && (
            <section className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[48px] p-10 animate-fade-in shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Plus className="w-32 h-32 text-accent" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">Add Payout Account</h3>
                  <button onClick={() => setShowAdd(false)} className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-red-500 transition-all">Close</button>
                </div>

                <form onSubmit={handleAdd} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Financial Institution</label>
                    <select 
                      required
                      onChange={(e) => {
                        const bank = availableBanks.find(b => b.code === e.target.value);
                        setNewBank({...newBank, bank_code: e.target.value, bank_name: bank?.name || ''});
                      }}
                      className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl px-6 py-5 text-sm font-bold text-text-primary focus:border-accent outline-none appearance-none"
                    >
                      <option value="">Select Bank</option>
                      {availableBanks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Account Number</label>
                      <input 
                        required
                        placeholder="0123456789"
                        value={newBank.account_number}
                        onChange={(e) => setNewBank({...newBank, account_number: e.target.value})}
                        className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl px-6 py-5 text-sm font-black text-text-primary focus:border-accent outline-none tracking-widest"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Account Identifier</label>
                      <input 
                        required
                        placeholder="Account Name"
                        value={newBank.account_name}
                        onChange={(e) => setNewBank({...newBank, account_name: e.target.value})}
                        className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl px-6 py-5 text-sm font-bold text-text-primary focus:border-accent outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full bg-accent text-white font-black py-6 rounded-2xl uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20"
                  >
                    {processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Setup Account"}
                  </button>
                </form>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodBankBankDetails;
