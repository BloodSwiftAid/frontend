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
  MapPin,
  Fingerprint
} from 'lucide-react';
import { paymentApi } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminBankDetails = () => {
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
      toast.error("Failed to load treasury accounts");
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
    setProcessing(true);
    try {
      await paymentApi.createBankDetail(newBank);
      toast.success("Treasury account registered successfully");
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
    if (!window.confirm("Permanently remove this platform treasury account?")) return;
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
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/admin/payouts" className="p-3 md:p-4 bg-glass border border-glass-border rounded-xl md:rounded-2xl hover:text-primary transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
              Treasury <span className="text-primary">Accounts</span>
            </h1>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mt-1 md:mt-2">
              Platform Payout Configuration
            </p>
          </div>
        </div>
        
        {banks.length < 3 && !showAdd && (
          <button 
            onClick={() => setShowAdd(true)}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl md:rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px]"
          >
            <Plus size={16} /> Register Account
          </button>
        )}
      </header>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Left Column: List of Banks */}
        <div className="flex-1 space-y-6 md:space-y-8">
           <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-3xl md:rounded-[48px] p-6 md:p-10 shadow-sm">
              <div className="flex justify-between items-center mb-8 md:mb-10">
                <h3 className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tighter">Registered Hubs</h3>
                <span className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest bg-glass px-4 py-1.5 rounded-full border border-glass-border">
                  {banks.length} / 3 Slots
                </span>
              </div>

              <div className="space-y-4 md:space-y-6">
                {banks.length > 0 ? banks.map((bank) => (
                  <div key={bank.id} className="p-6 md:p-8 bg-glass/20 border border-glass-border rounded-2xl md:rounded-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:border-primary/40 transition-all relative overflow-hidden">
                    <div className="flex items-center gap-4 md:gap-6 relative z-10">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/20 text-primary">
                        <Building2 size={24} className="md:w-8 md:h-8" />
                      </div>
                      <div className="min-w-0">
                        <h4 
                          className="font-black text-text-primary tracking-tight uppercase"
                          style={{ fontSize: (bank.bank_name || '').length > 20 ? '1rem' : '1.125rem' }}
                        >
                          {bank.bank_name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                          <p className="text-xs md:text-sm font-mono text-text-muted font-bold tracking-widest">{bank.account_number}</p>
                          <span className="hidden sm:block w-1 h-1 rounded-full bg-text-muted opacity-30" />
                          <p className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 size={12} /> Verified
                          </p>
                        </div>
                        <p 
                          className="font-black text-text-muted uppercase tracking-widest mt-2 md:mt-3 opacity-60"
                          style={{ fontSize: (bank.account_name || '').length > 25 ? '7px' : '9px' }}
                        >
                          {bank.account_name}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(bank.id)}
                      className="w-full sm:w-auto p-4 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      <span className="sm:hidden text-[9px] font-black uppercase tracking-widest">Remove Account</span>
                    </button>
                  </div>
                )) : (
                  <div className="py-20 text-center border-2 border-dashed border-glass-border rounded-3xl opacity-40">
                     <AlertCircle size={40} className="mx-auto mb-4 text-text-muted" />
                     <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">No accounts configured</p>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Right Column: Add Bank Form */}
        <div className={`flex-1 space-y-6 md:space-y-8 transition-all duration-500 ${showAdd ? 'opacity-100' : 'hidden lg:block lg:opacity-30 lg:pointer-events-none'}`}>
          <section className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-3xl md:rounded-[48px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8 md:mb-10">
                <h3 className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tighter">Add Bank Account</h3>
                <button onClick={() => setShowAdd(false)} className="text-[9px] font-black text-text-muted uppercase tracking-widest hover:text-accent transition-all">Discard</button>
              </div>

              <form onSubmit={handleAdd} className="space-y-6 md:space-y-8">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Select Bank</label>
                  <select 
                    required
                    onChange={(e) => {
                      const bank = availableBanks.find(b => b.code === e.target.value);
                      setNewBank({...newBank, bank_code: e.target.value, bank_name: bank?.name || ''});
                    }}
                    className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-[11px] md:text-sm font-bold text-text-primary focus:border-primary outline-none appearance-none"
                  >
                    <option value="">Select Bank</option>
                    {availableBanks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Account Number</label>
                    <input 
                      required
                      placeholder="0123456789"
                      value={newBank.account_number}
                      onChange={(e) => setNewBank({...newBank, account_number: e.target.value})}
                      className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-[11px] md:text-sm font-black text-text-primary focus:border-primary outline-none tracking-widest"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Account Name</label>
                    <input 
                      required
                      placeholder="ENTITY NAME"
                      value={newBank.account_name}
                      onChange={(e) => setNewBank({...newBank, account_name: e.target.value})}
                      className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-[11px] md:text-sm font-bold text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={processing}
                  className="w-full bg-primary text-white font-black py-5 md:py-6 rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 flex items-center justify-center"
                >
                  {processing ? <Loader2 size={20} className="animate-spin" /> : "Save Bank Details"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminBankDetails;
