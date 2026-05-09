import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  ChevronRight,
  Droplet,
  User,
  Calendar,
  Clock,
  Trash2,
  Edit,
  ArrowDownCircle,
  Database
} from 'lucide-react';
import { inventoryApi, adminApi } from '../../api';

const BloodBankInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [bloodTypeRegistry, setBloodTypeRegistry] = useState([]);
  const [globalConfig, setGlobalConfig] = useState({ commission_percentage: 10 });
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'donations', or 'pricing'
  const [showDonationModal, setShowDonationModal] = useState(false);
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
      const [invRes, donRes, statsRes, typesRes, configRes] = await Promise.all([
        inventoryApi.listInventory(),
        inventoryApi.listDonations(),
        inventoryApi.getStats(),
        adminApi.listBloodTypes(),
        adminApi.getGlobalConfig()
      ]);
      setInventory(invRes.data.results || invRes.data);
      setDonations(donRes.data.results || donRes.data);
      setStats(statsRes.data);
      setBloodTypeRegistry(typesRes.data.results || typesRes.data);
      setGlobalConfig(configRes.data);
    } catch (err) {
      console.error('Failed to fetch inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.createDonation(newDonation);
      setShowDonationModal(false);
      setNewDonation({
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
      fetchData();
      toast.success('Donation recorded successfully');
    } catch (err) {
      console.error('Failed to add donation:', err);
      const msg = err.response?.data?.message || 'Failed to record donation. Please check all fields.';
      toast.error(msg);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">Blood <span className="text-gradient">Inventory</span></h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Database className="w-3 h-3 text-accent" />
            Manage Stock & Donations
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowDonationModal(true)}
            className="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 gap-3 group"
          >
            <ArrowDownCircle className="w-5 h-5 transition-transform group-hover:translate-y-1" />
            <span className="font-bold tracking-tight">Record Donation</span>
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {bloodGroups.map(group => {
          const count = stats[group] || 0;
          const fillPercentage = Math.min(count * 10, 100);
          
          return (
            <div key={group} className="relative group overflow-hidden bg-card-bg/40 backdrop-blur-xl border border-glass-border p-5 rounded-[32px] hover:border-accent/50 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center font-black text-accent text-xs border border-accent/20">
                    {group}
                  </div>
                  <div className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-glass'}`} />
                </div>
                
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">Stock Level</p>
                  <h4 className="text-2xl font-black text-text-primary tracking-tighter">{count} <span className="text-xs text-text-secondary font-bold">Units</span></h4>
                </div>

                <div className="mt-4 relative h-1.5 w-full bg-glass rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-1000 ease-out rounded-full" 
                    style={{ width: `${fillPercentage}%` }}
                  >
                    <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all" />
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-glass border border-glass-border rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Active Stock
        </button>
        <button 
          onClick={() => setActiveTab('donations')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'donations' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Donation Logs
        </button>
        <button 
          onClick={() => setActiveTab('pricing')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pricing' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Pricing Settings
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : activeTab === 'inventory' ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-glass/50 border-b border-glass-border">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Units In Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Storage Zone</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Unit Price</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {inventory.filter(item => item.quantity > 0).map((item) => (
                <tr key={item.id} className="hover:bg-accent/5 transition-all group">
                  <td className="px-8 py-6 font-black text-text-primary text-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Droplet className="w-6 h-6 text-accent" />
                    </div>
                    {item.blood_group}
                  </td>
                  <td className="px-8 py-6 font-black text-text-primary text-lg">{item.quantity} Units</td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 rounded-full bg-glass border border-glass-border text-[10px] font-black uppercase tracking-widest text-text-secondary">
                      Zone {item.blood_group.charAt(0)}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-mono text-emerald-500 font-black">₦{item.price?.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 hover:bg-glass rounded-xl text-text-muted hover:text-accent transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'donations' ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-glass/50 border-b border-glass-border">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Donor Name</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Metrics</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Volume</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {donations.map((item) => (
                <tr key={item.id} className="hover:bg-accent/5 transition-all">
                  <td className="px-8 py-6">
                    <p className="font-black text-text-primary">{item.donor_name}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">{item.donor_phone}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-text-secondary font-bold uppercase tracking-widest text-[10px]">{item.donor_gender} | {item.donor_age} YRS</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent">
                      {item.blood_group}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] font-black text-text-primary uppercase tracking-widest">Hb: {item.hemoglobin_level} g/dL</p>
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Geno: {item.genotype}</p>
                  </td>
                  <td className="px-8 py-6 font-black text-text-primary">{item.volume_ml}ml</td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-text-secondary font-bold uppercase tracking-widest text-[10px]">{new Date(item.donation_date).toLocaleDateString()}</p>
                    <p className="text-[10px] text-text-muted">{new Date(item.donation_date).toLocaleTimeString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8">
            <div className="bg-glass/20 border border-glass-border rounded-[32px] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-glass/30 border-b border-glass-border">
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Type</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Availability</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Unit Price</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Market Rate</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border/20">
                    {bloodTypeRegistry.map(type => {
                      const invItem = inventory.find(i => i.blood_type === type.id || i.blood_group === type.group);
                      const currentPrice = invItem ? invItem.price : type.base_price;
                      // Display strictly the admin-set price as the marketplace reference
                      const displayMarketPrice = parseFloat(type.base_price);
                      const currentStock = invItem ? invItem.quantity : 0;
                      
                      return (
                        <tr key={type.id} className="hover:bg-accent/5 transition-all group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center font-black text-accent text-lg border border-accent/20 group-hover:bg-accent group-hover:text-white transition-all">
                                {type.group}
                              </div>
                              <div>
                                <p className="font-black text-text-primary text-base uppercase tracking-tight">{type.group}</p>
                                <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Blood Stock</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${currentStock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {currentStock} Units
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="inline-flex items-center bg-glass/40 border border-glass-border rounded-xl px-3 py-2 group-hover:border-accent/30 transition-all">
                              <span className="font-black text-text-secondary mr-2 text-xs">₦</span>
                              <input 
                                type="number"
                                className="bg-transparent border-none outline-none text-text-primary font-black w-24 text-right text-base"
                                value={currentPrice}
                                onChange={(e) => {
                                  const newVal = e.target.value;
                                  if (invItem) {
                                    const updated = inventory.map(i => i.id === invItem.id ? {...i, price: newVal} : i);
                                    setInventory(updated);
                                  } else {
                                    // If no inventory item exists, create a "virtual" one in the inventory state
                                    // this allows us to track the price without touching the registry
                                    const virtualItem = {
                                      id: `temp-${type.id}`,
                                      blood_type: type.id,
                                      blood_group: type.group,
                                      price: newVal,
                                      quantity: 0
                                    };
                                    setInventory([...inventory, virtualItem]);
                                  }
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="space-y-0.5">
                              <p className="text-base font-black text-accent tracking-tighter">₦{displayMarketPrice.toLocaleString()}</p>
                              <p className="text-[7px] text-text-muted font-bold uppercase tracking-widest">Standard Market Price</p>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button 
                              onClick={async () => {
                                try {
                                  const isVirtual = invItem && invItem.id.toString().startsWith('temp-');
                                  if (invItem && !isVirtual) {
                                    await inventoryApi.updateStock(invItem.id, { price: currentPrice });
                                  } else {
                                    await inventoryApi.createInventory({
                                      blood_type: type.id,
                                      price: currentPrice,
                                      quantity: 0
                                    });
                                  }
                                  fetchData();
                                } catch (err) {
                                  console.error('Failed to update pricing:', err);
                                }
                              }}
                              className="px-5 py-2.5 bg-accent text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-accent/10 hover:bg-accent-hover active:scale-95 transition-all whitespace-nowrap"
                            >
                              {invItem && !invItem.id.toString().startsWith('temp-') ? 'Save Price' : 'Initialize'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-darker/80 backdrop-blur-xl" onClick={() => setShowDonationModal(false)} />
          <div className="bg-card-bg border border-glass-border rounded-[48px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-12">
              <h2 className="text-3xl font-black text-text-primary mb-2 uppercase tracking-tighter">Add <span className="text-gradient">Donation</span></h2>
              <p className="text-text-secondary text-sm mb-10 font-bold uppercase tracking-widest">Register new blood donation record</p>

              <form onSubmit={handleAddDonation} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Donor Full Name</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                      placeholder="John Doe"
                      value={newDonation.donor_name}
                      onChange={(e) => setNewDonation({...newDonation, donor_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Phone Number</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                      placeholder="+234..."
                      value={newDonation.donor_phone}
                      onChange={(e) => setNewDonation({...newDonation, donor_phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Gender</label>
                    <select 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all appearance-none"
                      value={newDonation.donor_gender}
                      onChange={(e) => setNewDonation({...newDonation, donor_gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Age</label>
                    <input 
                      type="number"
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                      placeholder="25"
                      value={newDonation.donor_age}
                      onChange={(e) => setNewDonation({...newDonation, donor_age: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Blood Group</label>
                    <select 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all appearance-none"
                      value={newDonation.blood_group}
                      onChange={(e) => setNewDonation({...newDonation, blood_group: e.target.value})}
                    >
                      {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Volume (ML)</label>
                    <input 
                      type="number"
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold"
                      value={newDonation.volume_ml}
                      onChange={(e) => setNewDonation({...newDonation, volume_ml: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Hemoglobin Level (g/dL)</label>
                    <input 
                      type="number"
                      step="0.1"
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold"
                      placeholder="13.5"
                      value={newDonation.hemoglobin_level}
                      onChange={(e) => setNewDonation({...newDonation, hemoglobin_level: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Genotype</label>
                    <select 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all appearance-none font-bold"
                      value={newDonation.genotype}
                      onChange={(e) => setNewDonation({...newDonation, genotype: e.target.value})}
                    >
                      {['AA', 'AS', 'AC', 'SS', 'SC'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                   <button className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 uppercase font-black tracking-[0.2em]">
                     Commit Record
                   </button>
                   <button 
                     type="button"
                     onClick={() => setShowDonationModal(false)}
                     className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all"
                   >
                     Cancel Operation
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

export default BloodBankInventory;
