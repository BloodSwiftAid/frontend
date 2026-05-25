import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Database, 
  Edit, 
  Loader2, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inventoryApi, adminApi } from '../../api';
import { useIsVerified } from '../../hooks/useIsVerified';
import { toast } from 'react-hot-toast';

const BloodBankInventory = () => {
  const navigate = useNavigate();
  const isVerified = useIsVerified();
  const [inventory, setInventory] = useState([]);
  const [bloodTypeRegistry, setBloodTypeRegistry] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkItems, setBulkItems] = useState([
    { blood_group: 'O+', quantity: 1, notes: '' }
  ]);
  const [priceEdits, setPriceEdits] = useState({});
  const [newDonation, setNewDonation] = useState({
    donor_name: '',
    donor_phone: '',
    donor_email: '',
    donor_gender: 'Male',
    donor_age: '',
    blood_group: 'O+',
    volume_ml: 450,
    hemoglobin_level: '',
    genotype: 'AA',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, donRes, statsRes, typesRes] = await Promise.all([
        inventoryApi.listInventory(),
        inventoryApi.listDonations(),
        inventoryApi.getStats(),
        adminApi.listBloodTypes(),
      ]);
      setInventory(invRes.data.results || invRes.data);
      setDonations(donRes.data.results || donRes.data);
      setStats(statsRes.data);
      setBloodTypeRegistry(typesRes.data.results || typesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error('Verification Required');
      return;
    }
    try {
      await inventoryApi.createDonation(newDonation);
      setShowDonationModal(false);
      setNewDonation({
        donor_name: '', donor_phone: '', donor_email: '', donor_gender: 'Male',
        donor_age: '', blood_group: 'O+', volume_ml: 450, hemoglobin_level: '',
        genotype: 'AA', notes: ''
      });
      fetchData();
      toast.success('Donation Recorded');
    } catch (err) {
      toast.error('Failed to save donation');
    }
  };

  const handleBulkOnboard = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error('Verification Required');
      return;
    }
    try {
      await inventoryApi.bulkCreateInventory({ items: bulkItems });
      setShowBulkModal(false);
      setBulkItems([{ blood_group: 'O+', quantity: 1, notes: '' }]);
      fetchData();
      toast.success('Bulk Inventory Added');
    } catch (err) {
      toast.error('Failed to add bulk inventory');
    }
  };

  const handleUpdatePrice = async (typeId, invItem, newPrice) => {
    try {
      if (invItem) {
        await inventoryApi.updateStock(invItem.id, { price: newPrice });
      } else {
        await inventoryApi.createInventory({ blood_type: typeId, quantity: 0, price: newPrice });
      }
      toast.success('Price Updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update price');
    }
  };

  const addBulkRow = () => {
    setBulkItems([...bulkItems, { blood_group: 'O+', quantity: 1, notes: '' }]);
  };

  const removeBulkRow = (index) => {
    if (bulkItems.length > 1) {
      setBulkItems(bulkItems.filter((_, i) => i !== index));
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Blood Stock <span className="text-gradient">Inventory</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
            <Database className="w-3 h-3 text-primary" />
            Blood Inventory Management
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => isVerified ? setShowBulkModal(true) : toast.error('Verification required')}
            disabled={!isVerified}
            className={`flex-1 md:flex-none bg-glass border border-glass-border hover:border-primary/50 text-text-primary px-8 py-4 rounded-xl md:rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all ${!isVerified ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
          >
            <Plus className="w-5 h-5 text-primary" />
            <span className="font-black tracking-tight uppercase text-[10px]">Add Multiple Units</span>
          </button>
          <button 
            onClick={() => isVerified ? setShowDonationModal(true) : toast.error('Verification required')}
            disabled={!isVerified}
            className={`flex-1 md:flex-none btn btn-primary px-8 py-4 rounded-xl md:rounded-2xl shadow-xl gap-3 ${!isVerified ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-black tracking-tight uppercase text-[10px]">Record Donation</span>
          </button>
        </div>
      </header>

      {/* Stats Cluster */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
        {bloodGroups.map(group => {
          const count = stats[group] || 0;
          return (
            <div key={group} className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-4 md:p-5 rounded-2xl md:rounded-[32px] hover:border-primary/50 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-primary text-[10px] border border-primary/20">
                  {group}
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${count > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-glass'}`} />
              </div>
              <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Units</p>
              <h4 className="text-xl md:text-2xl font-black text-text-primary tracking-tighter">{count}</h4>
            </div>
          );
        })}
      </div>

      {/* Control Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-glass border border-glass-border rounded-xl md:rounded-2xl w-full sm:w-fit no-scrollbar">
        {['inventory', 'donations', 'pricing'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab === 'inventory' ? 'Active Stock' : tab === 'donations' ? 'Donation Logs' : 'Pricing Settings'}
          </button>
        ))}
      </div>

      {/* Data Visualization */}
      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-2xl md:rounded-[48px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            {activeTab === 'inventory' ? (
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-glass/50 border-b border-glass-border">
                  <tr>
                    {['Type', 'Stock', 'Zone', 'Price', 'Actions'].map(h => (
                      <th key={h} className={`px-8 py-5 text-[9px] font-black uppercase tracking-widest text-text-secondary ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/30">
                  {inventory.filter(item => item.quantity > 0).map((item) => (
                    <tr key={item.id} className="hover:bg-primary/5 transition-all">
                      <td className="px-8 py-5 font-black text-text-primary text-lg">{item.blood_group}</td>
                      <td className="px-8 py-5 font-black text-text-primary">{item.quantity} Units</td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-full bg-glass border border-glass-border text-[9px] font-black text-text-secondary">Z-{item.blood_group.charAt(0)}</span>
                      </td>
                      <td className="px-8 py-5 font-black text-emerald-500">₦{parseFloat(item.price || 0).toLocaleString()}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-glass rounded-lg transition-all text-text-muted hover:text-primary"><Edit size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'donations' ? (
              <div className="divide-y divide-glass-border/30">
                <div className="hidden md:grid grid-cols-5 bg-glass/50 border-b border-glass-border px-8 py-5 text-[9px] font-black uppercase tracking-widest text-text-secondary">
                  <span>Donor</span><span>Gender/Age</span><span>Group</span><span>Metrics</span><span className="text-right">Date</span>
                </div>
                {donations.map((item) => (
                  <div key={item.id} className="p-6 md:px-8 md:py-6 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0 hover:bg-primary/5 transition-all">
                    <div className="space-y-0.5">
                      <p className="font-black text-text-primary">{item.donor_name}</p>
                      <p className="text-[9px] text-text-muted font-bold tracking-widest uppercase">{item.donor_phone}</p>
                    </div>
                    <div className="flex md:block items-center gap-2">
                       <span className="md:hidden text-[8px] font-black text-text-muted uppercase">Info:</span>
                       <p className="text-[10px] font-black text-text-secondary uppercase">{item.donor_gender} • {item.donor_age}Y</p>
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase">{item.blood_group}</span>
                    </div>
                    <div className="space-y-0.5 text-[10px]">
                      <p className="font-black text-text-primary uppercase tracking-widest">Hb: {item.hemoglobin_level} g/dL</p>
                      <p className="text-text-secondary font-bold uppercase tracking-widest">Geno: {item.genotype}</p>
                    </div>
                    <div className="md:text-right flex md:block justify-between items-center border-t md:border-none pt-2 md:pt-0">
                      <p className="text-[10px] font-black text-text-primary">{new Date(item.donation_date).toLocaleDateString()}</p>
                      <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold">{new Date(item.donation_date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 md:p-8">
                <div className="bg-glass/10 border border-glass-border rounded-2xl md:rounded-3xl overflow-hidden">
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-glass/30 border-b border-glass-border">
                      <tr>
                        {['Blood Type', 'Availability', 'Unit Price', 'Market Reference', 'Action'].map(h => (
                          <th key={h} className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest text-text-secondary ${h === 'Action' ? 'text-right' : ''}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/20">
                      {bloodTypeRegistry.map(type => {
                        const invItem = inventory.find(i => i.blood_type === type.id || i.blood_group === type.group);
                        const currentPrice = priceEdits[type.id] !== undefined ? priceEdits[type.id] : (invItem ? invItem.price : type.base_price);
                        return (
                          <tr key={type.id} className="hover:bg-primary/5 transition-all">
                            <td className="px-8 py-5 font-black text-text-primary uppercase">{type.group}</td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${invItem?.quantity > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-accent/10 text-accent'}`}>{invItem?.quantity || 0} Units</span>
                            </td>
                            <td className="px-8 py-5">
                               <div className="inline-flex items-center bg-glass border border-glass-border rounded-xl px-3 py-1.5">
                                  <span className="text-xs font-black text-text-muted mr-2">₦</span>
                                  <input type="number" className="bg-transparent border-none outline-none w-20 text-right font-black text-sm" value={currentPrice} onChange={(e) => setPriceEdits({ ...priceEdits, [type.id]: e.target.value })} />
                               </div>
                            </td>
                            <td className="px-8 py-5 text-[10px] font-black text-primary uppercase">₦{parseFloat(type.base_price).toLocaleString()}</td>
                            <td className="px-8 py-5 text-right">
                              <button 
                                onClick={() => handleUpdatePrice(type.id, invItem, currentPrice)}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDonationModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-bg-darker/90 backdrop-blur-xl" onClick={() => setShowDonationModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card-bg border border-glass-border rounded-3xl md:rounded-[48px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter leading-none">Record <span className="text-gradient">Donation</span></h2>
                    <p className="text-[9px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-2">Add new donation record to inventory</p>
                  </div>
                  <button onClick={() => setShowDonationModal(false)} className="p-2 bg-glass border border-glass-border rounded-lg text-text-muted"><X size={18} /></button>
                </div>

                <form onSubmit={handleAddDonation} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Donor Name</label>
                      <input className="w-full bg-glass border border-glass-border rounded-xl py-3.5 px-6 text-text-primary outline-none focus:border-primary/50" placeholder="Required" value={newDonation.donor_name} onChange={(e) => setNewDonation({...newDonation, donor_name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Phone Number</label>
                      <input className="w-full bg-glass border border-glass-border rounded-xl py-3.5 px-6 text-text-primary outline-none focus:border-primary/50" placeholder="+234..." value={newDonation.donor_phone} onChange={(e) => setNewDonation({...newDonation, donor_phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Gender</label>
                      <select className="w-full bg-glass border border-glass-border rounded-xl py-3.5 px-6 text-text-primary outline-none focus:border-primary/50 appearance-none" value={newDonation.donor_gender} onChange={(e) => setNewDonation({...newDonation, donor_gender: e.target.value})}>
                        <option value="Male">Male</option><option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Age</label>
                      <input type="number" className="w-full bg-glass border border-glass-border rounded-xl py-3.5 px-6 text-text-primary outline-none focus:border-primary/50" value={newDonation.donor_age} onChange={(e) => setNewDonation({...newDonation, donor_age: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Group</label>
                      <select className="w-full bg-glass border border-glass-border rounded-xl py-3.5 px-6 text-text-primary outline-none focus:border-primary/50 appearance-none font-black" value={newDonation.blood_group} onChange={(e) => setNewDonation({...newDonation, blood_group: e.target.value})}>
                        {bloodGroups.map(g => <option key={g} value={g} className="bg-card-bg text-text-primary">{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Vol (ML)</label>
                      <input type="number" className="w-full bg-glass border border-glass-border rounded-xl py-3.5 px-6 text-text-primary outline-none focus:border-primary/50 font-black" value={newDonation.volume_ml} onChange={(e) => setNewDonation({...newDonation, volume_ml: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Hb Level (g/dL)</label>
                      <input type="number" step="0.1" className="w-full bg-glass border border-glass-border rounded-xl py-3.5 px-6 text-text-primary outline-none focus:border-primary/50" value={newDonation.hemoglobin_level} onChange={(e) => setNewDonation({...newDonation, hemoglobin_level: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Genotype</label>
                      <select className="w-full bg-glass border border-glass-border rounded-xl py-3.5 px-6 text-text-primary outline-none focus:border-primary/50 appearance-none font-black" value={newDonation.genotype} onChange={(e) => setNewDonation({...newDonation, genotype: e.target.value})}>
                        {['AA', 'AS', 'AC', 'SS', 'SC'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <button className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20 uppercase font-black tracking-[0.3em] text-[10px]">Save Donation</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {showBulkModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-bg-darker/90 backdrop-blur-xl" onClick={() => setShowBulkModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card-bg border border-glass-border rounded-3xl md:rounded-[48px] w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter leading-none">Bulk <span className="text-gradient">Import</span></h2>
                    <p className="text-[9px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-2">Add multiple blood group records to inventory</p>
                  </div>
                  <button onClick={() => setShowBulkModal(false)} className="p-2 bg-glass border border-glass-border rounded-lg text-text-muted transition-all hover:text-accent"><X size={18} /></button>
                </div>

                <form onSubmit={handleBulkOnboard} className="space-y-6">
                  <div className="space-y-4">
                    {bulkItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-glass/20 p-6 rounded-2xl border border-glass-border">
                        <div className="sm:col-span-3 space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-widest text-text-muted ml-1">Blood Group</label>
                          <select 
                            className="w-full bg-glass border border-glass-border rounded-xl py-3 px-4 text-text-primary outline-none focus:border-primary/50 appearance-none font-black text-sm"
                            value={item.blood_group}
                            onChange={(e) => {
                              const newItems = [...bulkItems];
                              newItems[index].blood_group = e.target.value;
                              setBulkItems(newItems);
                            }}
                          >
                            {bloodGroups.map(g => <option key={g} value={g} className="bg-card-bg text-text-primary">{g}</option>)}
                          </select>
                        </div>
                        <div className="sm:col-span-3 space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-widest text-text-muted ml-1">Volume (Units)</label>
                          <input 
                            type="number"
                            className="w-full bg-glass border border-glass-border rounded-xl py-3 px-4 text-text-primary outline-none focus:border-primary/50 font-black text-sm"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...bulkItems];
                              newItems[index].quantity = parseInt(e.target.value);
                              setBulkItems(newItems);
                            }}
                            required
                          />
                        </div>
                        <div className="sm:col-span-5 space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-widest text-text-muted ml-1">Reference / Details</label>
                          <input 
                            className="w-full bg-glass border border-glass-border rounded-xl py-3 px-4 text-text-primary outline-none focus:border-primary/50 text-xs"
                            placeholder="Storage Zone, Batch ID..."
                            value={item.notes}
                            onChange={(e) => {
                              const newItems = [...bulkItems];
                              newItems[index].notes = e.target.value;
                              setBulkItems(newItems);
                            }}
                          />
                        </div>
                        <div className="sm:col-span-1 flex justify-end">
                           <button 
                             type="button"
                             onClick={() => removeBulkRow(index)}
                             className="p-3 text-text-muted hover:text-accent transition-all bg-glass rounded-xl border border-glass-border hover:border-accent/30"
                           >
                             <X size={16} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={addBulkRow}
                      className="flex-1 py-4 rounded-2xl border border-dashed border-glass-border text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Add Row
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] btn btn-primary py-4 rounded-2xl shadow-xl shadow-primary/20 uppercase font-black tracking-[0.3em] text-[10px]"
                    >
                      Add Bulk Inventory
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BloodBankInventory;
