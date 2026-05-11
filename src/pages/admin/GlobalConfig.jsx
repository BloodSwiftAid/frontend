import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { 
  Settings, 
  Save, 
  Percent, 
  DollarSign, 
  History,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const GlobalConfigPage = () => {
  const [config, setConfig] = useState({
    commission_percentage: 10,
    allowed_free_payouts: 2,
    payout_charge_fee: 50,
    address: '',
    contact_email: '',
    contact_phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await adminApi.getGlobalConfig();
      setConfig(res.data);
    } catch (error) {
      toast.error("Failed to load system configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateGlobalConfig(config);
      toast.success("System configuration updated successfully");
    } catch (error) {
      toast.error("Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10 pb-20">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
          Global <span className="text-primary">Config</span>
        </h1>
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          Core System Governance Protocol
        </p>
      </header>

      <form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Financial Parameters */}
        <div className="flex-1 bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-8 md:p-12 rounded-3xl md:rounded-[56px] space-y-8 md:space-y-10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/20 text-primary">
              <Percent size={24} className="md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tighter">Revenue Insights</h3>
              <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Financial variables</p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Commission (%)</label>
              <input 
                type="number"
                value={config.commission_percentage}
                onChange={(e) => setConfig({...config, commission_percentage: e.target.value})}
                className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-lg md:text-xl font-black text-text-primary focus:border-primary outline-none transition-all"
                placeholder="10.00"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Free Payouts / Mo</label>
              <input 
                type="number"
                value={config.allowed_free_payouts}
                onChange={(e) => setConfig({...config, allowed_free_payouts: e.target.value})}
                className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-lg md:text-xl font-black text-text-primary focus:border-primary outline-none transition-all"
                placeholder="2"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Payout Fee (₦)</label>
              <input 
                type="number"
                value={config.payout_charge_fee}
                onChange={(e) => setConfig({...config, payout_charge_fee: e.target.value})}
                className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-lg md:text-xl font-black text-text-primary focus:border-primary outline-none transition-all"
                placeholder="50.00"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex-1 bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-8 md:p-12 rounded-3xl md:rounded-[56px] space-y-8 md:space-y-10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-500">
              <MapPin size={24} className="md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tighter">System Meta</h3>
              <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Public identifier</p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Support Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="email"
                  value={config.contact_email}
                  onChange={(e) => setConfig({...config, contact_email: e.target.value})}
                  className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl pl-16 pr-6 py-4 md:py-5 text-sm md:text-lg font-bold text-text-primary focus:border-primary outline-none transition-all"
                  placeholder="support@swiftaid.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Support Phone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="text"
                  value={config.contact_phone}
                  onChange={(e) => setConfig({...config, contact_phone: e.target.value})}
                  className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl pl-16 pr-6 py-4 md:py-5 text-sm md:text-lg font-bold text-text-primary focus:border-primary outline-none transition-all"
                  placeholder="+234 ..."
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Address</label>
              <textarea 
                value={config.address}
                onChange={(e) => setConfig({...config, address: e.target.value})}
                className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-sm md:text-lg font-bold text-text-primary focus:border-primary outline-none transition-all min-h-[100px] md:min-h-[120px]"
                placeholder="Physical HQ Address"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 md:py-6 rounded-xl md:rounded-2xl flex items-center justify-center gap-4 shadow-xl shadow-primary/20"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            Commit Protocol
          </button>
        </div>
      </form>

      {/* Safety Notice */}
      <div className="bg-amber-500/5 border border-amber-500/20 p-6 md:p-8 rounded-2xl md:rounded-3xl flex items-start gap-4 md:gap-6">
        <AlertCircle size={24} className="text-amber-500 shrink-0" />
        <div>
          <h4 className="text-amber-500 font-black uppercase tracking-widest text-[10px] md:text-xs mb-1 md:mb-2">Protocol Warning</h4>
          <p className="text-text-secondary text-[9px] md:text-[10px] font-black uppercase leading-relaxed opacity-80">
            Modifying parameters affects live transaction processing and revenue distribution. 
            Commission changes apply to all future orders immediately upon commitment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfigPage;
