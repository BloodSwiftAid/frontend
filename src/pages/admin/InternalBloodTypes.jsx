import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Plus, 
  Edit2, 
  Save, 
  X, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Activity,
  Zap,
  Globe,
  Database,
  ChevronRight,
  RefreshCw,
  Coins
} from 'lucide-react';
import { adminApi } from '../../api';

const InternalBloodTypes = () => {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [globalConfig, setGlobalConfig] = useState({ commission_percentage: 10 });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newData, setNewData] = useState({ group: '', base_price: 0, is_active: true });
  const [updatingConfig, setUpdatingConfig] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [btRes, configRes] = await Promise.all([
        adminApi.listBloodTypes(),
        adminApi.getGlobalConfig()
      ]);
      setBloodTypes(btRes.data.results || btRes.data);
      setGlobalConfig(configRes.data);
    } catch (err) {
      console.error('Registry sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalCommission = async (val) => {
    setUpdatingConfig(true);
    try {
      const { data } = await adminApi.updateGlobalConfig({ commission_percentage: val });
      setGlobalConfig(data);
    } catch (err) {
      console.error('Markup update failed:', err);
    } finally {
      setUpdatingConfig(false);
    }
  };

  const handleEdit = (bt) => {
    setEditingId(bt.id);
    setEditData({ ...bt });
  };

  const handleUpdate = async () => {
    try {
      await adminApi.updateBloodType(editingId, editData);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error('Asset update failed:', err);
    }
  };

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    try {
      await adminApi.createBloodType(newData);
      setShowAddModal(false);
      setNewData({ group: '', base_price: 0, is_active: true });
      fetchData();
    } catch (err) {
      console.error('Asset registration failed:', err);
    }
  };

  const activeAssets = bloodTypes.filter(b => b.is_active).length;
  const avgPrice = bloodTypes.length > 0 ? bloodTypes.reduce((acc, curr) => acc + parseFloat(curr.base_price), 0) / bloodTypes.length : 0;

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Blood Type <span className="text-gradient">Registry</span>
          </h1>
          <p className="text-text-secondary flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
            <Globe className="w-3.5 h-3.5 text-accent" />
            Global Blood Type Standards
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary px-10 py-5 rounded-[28px] gap-4 shadow-2xl shadow-accent/20 group"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-500">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Add Blood Type</span>
        </button>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Types', value: activeAssets, icon: Database, color: 'text-primary' },
          { label: 'Avg Base Price', value: `₦${Math.round(avgPrice).toLocaleString()}`, icon: Coins, color: 'text-emerald-500' },
          { label: 'Market Markup', value: `${globalConfig.commission_percentage}%`, icon: TrendingUp, color: 'text-accent' },
          { label: 'Network Integrity', value: 'SECURE', icon: ShieldCheck, color: 'text-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-8 rounded-[40px] hover:border-accent/30 transition-all group shadow-sm">
            <div className={`w-14 h-14 rounded-2xl bg-glass border border-glass-border flex items-center justify-center ${stat.color} mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-black/5`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">{stat.label}</p>
            <h4 className="text-3xl font-black text-text-primary tracking-tighter uppercase">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[56px] overflow-hidden shadow-2xl relative">
            <div className="p-10 border-b border-glass-border bg-glass/20 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Blood Type Registry</h3>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1 opacity-60">Baseline reference pricing for cross-facility coordination</p>
              </div>
              <button onClick={fetchData} className="p-4 bg-glass border border-glass-border rounded-2xl text-text-muted hover:text-accent transition-all group">
                 <RefreshCw className={`w-5 h-5 group-hover:rotate-180 transition-transform ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-glass/30 border-b border-glass-border">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Asset Group</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Reference Base</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Market Projection</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-center">Protocol</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/30">
                  {bloodTypes.map((bt) => {
                    const marketPrice = parseFloat(bt.base_price) * (1 + globalConfig.commission_percentage / 100);
                    return (
                      <tr key={bt.id} className="hover:bg-accent/5 transition-all group/row">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border shadow-xl shadow-black/5 transition-all duration-500 group-hover/row:scale-110 group-hover/row:rotate-3 ${bt.is_active ? 'bg-accent/10 border-accent/20' : 'bg-glass border-glass-border'}`}>
                              <Droplet className={`w-8 h-8 ${bt.is_active ? 'text-accent' : 'text-text-muted'}`} />
                            </div>
                            <div>
                               <p className="text-3xl font-black text-text-primary tracking-tighter group-hover/row:text-accent transition-colors">{bt.group}</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">Asset Node</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          {editingId === bt.id ? (
                            <div className="inline-flex items-center bg-glass border-2 border-accent/30 rounded-2xl px-6 py-3 shadow-inner">
                               <span className="text-accent font-black mr-3">₦</span>
                               <input 
                                 type="number"
                                 className="bg-transparent border-none outline-none text-text-primary font-black w-28 text-right text-xl"
                                 value={editData.base_price}
                                 onChange={(e) => setEditData({...editData, base_price: e.target.value})}
                               />
                            </div>
                          ) : (
                            <p className="text-2xl font-black text-text-primary tracking-tight">₦{parseFloat(bt.base_price).toLocaleString()}</p>
                          )}
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="space-y-1">
                              <p className="text-2xl font-black text-emerald-500 tracking-tight">₦{marketPrice.toLocaleString()}</p>
                              <p className="text-[9px] font-black uppercase text-emerald-500/50 tracking-widest flex items-center justify-end gap-2">
                                 <TrendingUp className="w-3 h-3" />
                                 +{globalConfig.commission_percentage}% Markup
                              </p>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <button 
                             onClick={() => {
                               if(editingId === bt.id) setEditData({...editData, is_active: !editData.is_active});
                               else adminApi.updateBloodType(bt.id, { is_active: !bt.is_active }).then(fetchData);
                             }}
                             className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${bt.is_active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-glass text-text-muted border border-glass-border'}`}
                          >
                            {bt.is_active ? 'Active' : 'Offline'}
                          </button>
                        </td>
                        <td className="px-10 py-8 text-right">
                          {editingId === bt.id ? (
                            <div className="flex justify-end gap-4">
                              <button onClick={handleUpdate} className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                                <Save className="w-5 h-5" />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-4 bg-glass border border-glass-border rounded-2xl text-text-muted hover:text-accent transition-all">
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => handleEdit(bt)} className="p-5 bg-glass border border-glass-border rounded-2xl text-text-muted hover:text-accent transition-all shadow-xl hover:shadow-accent/20 group/btn">
                              <Edit2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-accent/10 border border-accent/20 rounded-[56px] p-12 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
              <TrendingUp className="w-32 h-32 text-accent" />
            </div>
            <div className="relative z-10 space-y-10">
               <div className="space-y-4">
                  <div className="inline-block px-4 py-1.5 bg-accent/20 border border-accent/30 rounded-full">
                     <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Revenue Protocol</span>
                  </div>
                  <h3 className="text-4xl font-black text-text-primary uppercase tracking-tighter leading-none">Market <span className="text-gradient">Markup</span></h3>
               </div>
               
               <div className="space-y-6">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Global Platform Commission (%)</label>
                    <div className="relative">
                       <input 
                         type="number"
                         className="w-full bg-glass border-2 border-accent/30 rounded-[32px] py-8 px-10 text-4xl font-black text-accent outline-none focus:border-accent transition-all shadow-inner"
                         value={globalConfig.commission_percentage}
                         onChange={(e) => updateGlobalCommission(e.target.value)}
                         disabled={updatingConfig}
                       />
                       <div className="absolute right-10 top-1/2 -translate-y-1/2 text-4xl font-black text-accent/30">%</div>
                       {updatingConfig && (
                         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                           <Activity className="animate-spin w-12 h-12 text-accent" />
                         </div>
                       )}
                    </div>
                 </div>
                 <div className="p-8 bg-glass border border-accent/10 rounded-[32px]">
                    <p className="text-[11px] text-text-secondary leading-relaxed font-black uppercase tracking-tight opacity-80">
                      This markup is applied globally to all biological transactions. Modifying this parameter will immediately affect marketplace pricing across the entire clinical network.
                    </p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[56px] p-12 space-y-10">
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                 <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              Impact Summary
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Baseline Reference', text: 'Establishes the minimum biological asset valuation.' },
                { title: 'Facility Autonomy', text: 'Local nodes retain pricing variance within defined bands.' },
                { title: 'Inventory Control', text: 'De-activated assets are restricted from future procurement.' },
                { title: 'Financial Regulation', text: 'Global markup regulates system-wide fiscal health.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-text-primary uppercase tracking-widest">{item.title}</p>
                     <p className="text-xs text-text-muted font-black uppercase tracking-tight opacity-60">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Definition Wizard */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-bg-darker/95 backdrop-blur-3xl" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-2xl bg-card-bg border border-glass-border rounded-[64px] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary" />
            
            <div className="p-12 md:p-16 space-y-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                     <div className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Asset Definition</span>
                     </div>
                     <h2 className="text-5xl font-black text-text-primary uppercase tracking-tighter leading-none">Register <span className="text-gradient">Asset</span></h2>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="p-4 bg-glass border border-glass-border rounded-2xl text-text-muted hover:text-accent transition-all">
                     <X className="w-6 h-6" />
                  </button>
               </div>

              <form onSubmit={handleCreate} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Asset Identifier (Group)</label>
                    <input 
                      required
                      className="w-full bg-glass border-2 border-glass-border rounded-[32px] py-8 px-10 text-4xl font-black text-text-primary outline-none focus:border-accent transition-all shadow-inner uppercase"
                      placeholder="E.G. O-"
                      value={newData.group}
                      onChange={(e) => setNewData({...newData, group: e.target.value.toUpperCase()})}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Baseline Reference Price (₦)</label>
                    <div className="relative">
                       <input 
                         required
                         type="number"
                         className="w-full bg-glass border-2 border-glass-border rounded-[32px] py-8 px-10 text-4xl font-black text-text-primary outline-none focus:border-accent transition-all shadow-inner"
                         placeholder="7500"
                         value={newData.base_price}
                         onChange={(e) => setNewData({...newData, base_price: e.target.value})}
                       />
                       <div className="absolute left-10 top-1/2 -translate-y-1/2 text-4xl font-black text-text-muted/20">₦</div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-glass-border flex flex-col md:flex-row gap-6">
                  <button 
                    type="submit"
                    className="flex-1 btn btn-primary py-8 rounded-[32px] shadow-2xl shadow-accent/40 font-black uppercase tracking-[0.4em] text-xs bg-accent border-none flex items-center justify-center gap-4 group"
                  >
                    <span>Register Global Asset</span>
                    <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="md:w-48 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-all border border-glass-border rounded-[32px] bg-glass"
                  >
                    Abort Registry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalBloodTypes;
