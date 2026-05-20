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
      console.error('Database sync failed:', err);
    } finally {
      setLoading(false);
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
      console.error('Blood type update failed:', err);
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
      console.error('Blood type registration failed:', err);
    }
  };

  const activeTypes = bloodTypes.filter(b => b.is_active).length;
  const avgPrice = bloodTypes.length > 0 ? bloodTypes.reduce((acc, curr) => acc + parseFloat(curr.base_price), 0) / bloodTypes.length : 0;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Blood Type <span className="text-primary">Database</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-primary" />
            Global Blood Standards
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto btn btn-primary px-8 py-4 rounded-xl md:rounded-[28px] flex items-center justify-center gap-4 shadow-xl shadow-primary/20 group"
        >
          <Plus size={18} />
          <span className="font-black uppercase tracking-widest text-[10px]">Add Blood Type</span>
        </button>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {[
          { label: 'Active Types', value: activeTypes, icon: Database, color: 'text-primary' },
          { label: 'Avg Price', value: `₦${Math.round(avgPrice).toLocaleString()}`, icon: Coins, color: 'text-emerald-500' },
          { label: 'Integrity', value: 'SECURE', icon: ShieldCheck, color: 'text-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-6 md:p-8 rounded-3xl md:rounded-[40px] hover:border-primary/30 transition-all group shadow-sm">
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-glass border border-glass-border flex items-center justify-center ${stat.color} mb-4 md:mb-6`}>
              <stat.icon size={20} className="md:w-7 md:h-7" />
            </div>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{stat.label}</p>
            <h4 className="text-xl md:text-3xl font-black text-text-primary tracking-tighter truncate">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        <div className="lg:col-span-8">
          <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-3xl md:rounded-[56px] overflow-hidden shadow-2xl relative">
            <div className="p-6 md:p-10 border-b border-glass-border bg-glass/20 flex items-center justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tight">Blood Type Overview</h3>
                <p className="text-[8px] md:text-[10px] text-text-muted font-black uppercase tracking-widest mt-1 opacity-60">Reference baseline pricing</p>
              </div>
              <button onClick={fetchData} className="p-3 md:p-4 bg-glass border border-glass-border rounded-xl text-text-muted">
                 <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-glass/30 border-b border-glass-border">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Group</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Base Price</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-muted text-center">Status</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/30">
                  {bloodTypes.map((bt) => (
                    <tr key={bt.id} className="hover:bg-primary/5 transition-all group/row">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${bt.is_active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-glass border-glass-border text-text-muted'}`}>
                            <Droplet size={24} />
                          </div>
                          <p className="text-2xl font-black text-text-primary tracking-tighter">{bt.group}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        {editingId === bt.id ? (
                          <div className="inline-flex items-center bg-glass border-2 border-primary/30 rounded-xl px-4 py-2">
                             <span className="text-primary font-black mr-2 text-sm">₦</span>
                             <input 
                               type="number"
                               className="bg-transparent border-none outline-none text-text-primary font-black w-24 text-right text-lg"
                               value={editData.base_price}
                               onChange={(e) => setEditData({...editData, base_price: e.target.value})}
                             />
                          </div>
                        ) : (
                          <p className="text-xl font-black text-text-primary tracking-tight">₦{parseFloat(bt.base_price).toLocaleString()}</p>
                        )}
                      </td>
                      <td className="px-10 py-8 text-center">
                        <button 
                           onClick={() => {
                             if(editingId === bt.id) setEditData({...editData, is_active: !editData.is_active});
                             else adminApi.updateBloodType(bt.id, { is_active: !bt.is_active }).then(fetchData);
                           }}
                           className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${bt.is_active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-glass text-text-muted border border-glass-border'}`}
                        >
                          {bt.is_active ? 'Active' : 'Offline'}
                        </button>
                      </td>
                      <td className="px-10 py-8 text-right">
                        {editingId === bt.id ? (
                          <div className="flex justify-end gap-3">
                            <button onClick={handleUpdate} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20"><Save size={18} /></button>
                            <button onClick={() => setEditingId(null)} className="p-3 bg-glass border border-glass-border rounded-xl text-text-muted"><X size={18} /></button>
                          </div>
                        ) : (
                          <button onClick={() => handleEdit(bt)} className="p-4 bg-glass border border-glass-border rounded-xl text-primary hover:bg-primary hover:text-white transition-all"><Edit2 size={18} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
               {bloodTypes.map((bt) => (
                  <div key={bt.id} className="bg-glass/50 border border-glass-border rounded-2xl p-5 space-y-4">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${bt.is_active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-glass border-glass-border text-text-muted'}`}>
                              <Droplet size={20} />
                           </div>
                           <h3 className="text-xl font-black text-text-primary tracking-tighter">{bt.group}</h3>
                        </div>
                        <div className="flex gap-2">
                           {editingId === bt.id ? (
                              <>
                                 <button onClick={handleUpdate} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20"><Save size={16} /></button>
                                 <button onClick={() => setEditingId(null)} className="p-3 bg-glass border border-glass-border rounded-xl text-text-muted"><X size={16} /></button>
                              </>
                           ) : (
                              <button onClick={() => handleEdit(bt)} className="p-3 bg-glass border border-glass-border rounded-xl text-primary"><Edit2 size={16} /></button>
                           )}
                        </div>
                     </div>
                     
                     <div className="flex justify-between items-end pt-4 border-t border-glass-border">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Base Price</span>
                           {editingId === bt.id ? (
                              <div className="flex items-center bg-glass border-2 border-primary/30 rounded-lg px-2 py-1 mt-1">
                                 <span className="text-primary font-black mr-1 text-[10px]">₦</span>
                                 <input 
                                    type="number"
                                    className="bg-transparent border-none outline-none text-text-primary font-black w-16 text-xs"
                                    value={editData.base_price}
                                    onChange={(e) => setEditData({...editData, base_price: e.target.value})}
                                 />
                              </div>
                           ) : (
                              <span className="text-lg font-black text-text-primary">₦{parseFloat(bt.base_price).toLocaleString()}</span>
                           )}
                        </div>
                        <button 
                           onClick={() => {
                             if(editingId === bt.id) setEditData({...editData, is_active: !editData.is_active});
                             else adminApi.updateBloodType(bt.id, { is_active: !bt.is_active }).then(fetchData);
                           }}
                           className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${bt.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-glass text-text-muted'}`}
                        >
                           {bt.is_active ? 'Active' : 'Offline'}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 md:space-y-10">
          <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-3xl md:rounded-[56px] p-8 md:p-12 space-y-6 md:space-y-10">
            <h3 className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tighter flex items-center gap-3">
              <AlertCircle size={24} className="text-primary" />
              Impact Summary
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Base Price', text: 'Minimum price valuation reference.' },
                { title: 'Autonomy', text: 'Pricing variance allowed for blood banks.' },
                { title: 'Control', text: 'Access restriction parameters.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-text-primary uppercase tracking-widest">{item.title}</p>
                     <p className="text-[10px] text-text-muted font-black uppercase tracking-tight opacity-60 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Definition Wizard */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-bg-dark/80 backdrop-blur-xl animate-fade-in overflow-hidden">
          <div className="relative w-full max-w-2xl bg-card-bg border border-glass-border rounded-3xl md:rounded-[64px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            
            <div className="p-8 md:p-16 space-y-8 md:space-y-12 overflow-y-auto no-scrollbar max-h-[90vh]">
               <div className="flex justify-between items-start">
                  <div className="space-y-2 md:space-y-4">
                     <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                        <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest">Blood Type Definition</span>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black text-text-primary uppercase tracking-tighter leading-none">Register <span className="text-primary">Blood Type</span></h2>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="p-3 md:p-4 bg-glass border border-glass-border rounded-xl text-text-muted">
                     <X size={20} />
                  </button>
               </div>

              <form onSubmit={handleCreate} className="space-y-8 md:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted ml-4">Blood Group</label>
                    <input 
                      required
                      className="w-full bg-glass border-2 border-glass-border rounded-2xl md:rounded-[32px] py-5 md:py-8 px-6 md:px-10 text-2xl md:text-4xl font-black text-text-primary outline-none focus:border-primary transition-all uppercase"
                      placeholder="E.G. O-"
                      value={newData.group}
                      onChange={(e) => setNewData({...newData, group: e.target.value.toUpperCase()})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted ml-4">Reference Price (₦)</label>
                    <div className="relative">
                       <input 
                         required
                         type="number"
                         className="w-full bg-glass border-2 border-glass-border rounded-2xl md:rounded-[32px] py-5 md:py-8 px-6 md:px-10 text-2xl md:text-4xl font-black text-text-primary outline-none focus:border-primary transition-all"
                         placeholder="7500"
                         value={newData.base_price}
                         onChange={(e) => setNewData({...newData, base_price: e.target.value})}
                       />
                       <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-black text-text-muted/20">₦</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 md:pt-8 border-t border-glass-border flex flex-col sm:flex-row gap-4 md:gap-6">
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-5 md:py-8 rounded-2xl md:rounded-[32px] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    <span>Register Blood Type</span>
                    <ShieldCheck size={20} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="sm:w-32 py-5 md:py-8 text-[10px] font-black uppercase tracking-widest text-text-muted border border-glass-border rounded-2xl md:rounded-[32px] bg-glass"
                  >
                    Cancel
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
