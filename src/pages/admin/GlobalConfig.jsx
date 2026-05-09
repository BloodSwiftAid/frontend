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
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header>
        <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
          Global <span className="text-gradient">Config</span>
        </h1>
        <p className="text-text-secondary mt-4 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Core System Governance Protocol
        </p>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Financial Parameters */}
        <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-12 rounded-[56px] space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
              <Percent className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Revenue Insights</h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Platform financial variables</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Marketplace Platform Commission (%)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={config.commission_percentage}
                  onChange={(e) => setConfig({...config, commission_percentage: e.target.value})}
                  className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl px-8 py-5 text-xl font-black focus:border-accent transition-all outline-none"
                  placeholder="10.00"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Allowed Free Payouts / Month</label>
              <div className="relative">
                <input 
                  type="number"
                  value={config.allowed_free_payouts}
                  onChange={(e) => setConfig({...config, allowed_free_payouts: e.target.value})}
                  className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl px-8 py-5 text-xl font-black focus:border-accent transition-all outline-none"
                  placeholder="2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Post-Limit Payout Fee (₦)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={config.payout_charge_fee}
                  onChange={(e) => setConfig({...config, payout_charge_fee: e.target.value})}
                  className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl px-8 py-5 text-xl font-black focus:border-accent transition-all outline-none"
                  placeholder="50.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-12 rounded-[56px] space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">System Meta</h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Public identifier credentials</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input 
                  type="email"
                  value={config.contact_email}
                  onChange={(e) => setConfig({...config, contact_email: e.target.value})}
                  className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl pl-16 pr-8 py-5 text-lg font-bold focus:border-blue-500 transition-all outline-none"
                  placeholder="support@swiftaid.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Support Phone</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input 
                  type="text"
                  value={config.contact_phone}
                  onChange={(e) => setConfig({...config, contact_phone: e.target.value})}
                  className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl pl-16 pr-8 py-5 text-lg font-bold focus:border-blue-500 transition-all outline-none"
                  placeholder="+234 ..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Corporate Address</label>
              <div className="relative">
                <textarea 
                  value={config.address}
                  onChange={(e) => setConfig({...config, address: e.target.value})}
                  className="w-full bg-bg-darker/50 border-2 border-glass-border rounded-2xl px-8 py-5 text-lg font-bold focus:border-blue-500 transition-all outline-none min-h-[120px]"
                  placeholder="Physical HQ Address"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-accent text-bg-dark font-black uppercase tracking-[0.4em] py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-accent/20"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Commit Parameters
          </button>
        </div>
      </form>

      {/* Safety Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl flex items-start gap-6">
        <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
        <div>
          <h4 className="text-amber-500 font-black uppercase tracking-widest text-sm mb-2">Protocol Warning</h4>
          <p className="text-text-secondary text-xs font-bold leading-relaxed uppercase opacity-80">
            Modifying these parameters will affect live transaction processing and revenue distribution across the entire grid. 
            Commission changes will apply to all future orders immediately upon commitment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfigPage;
