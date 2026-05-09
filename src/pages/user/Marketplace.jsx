import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Filter, 
  Droplet, 
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { inventoryApi, transactionApi } from '../../api';

const BloodCard = ({ group, product, bank, location, price, onOrder }) => (
  <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-8 rounded-[40px] hover:border-accent/40 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-accent/5">
    <div className="absolute top-0 right-0 p-6">
      <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
        In Stock
      </div>
    </div>
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="w-28 h-28 bg-accent rounded-[32px] flex flex-col items-center justify-center text-white shadow-2xl shadow-accent/20 group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
        <span className="text-4xl font-black relative z-10">{group}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 relative z-10">Blood Unit</span>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">{bank?.name || 'Authorized Bank'}</h3>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            {location?.area || 'Central'}, {location?.state || 'Lagos'}
          </span>
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary">
            <Navigation className="w-3.5 h-3.5 text-accent" />
            {location?.street || 'Main St'}
          </span>
        </div>
      </div>
      <div className="text-center md:text-right space-y-6">
        <div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Cost per Unit</p>
          <p className="text-3xl font-black text-text-primary">₦{price?.toLocaleString()}</p>
        </div>
        <button 
          onClick={() => onOrder(product)}
          className="btn btn-primary px-10 py-4 rounded-2xl group/btn"
        >
          <span className="font-black uppercase tracking-widest text-xs">Place Order</span>
          <ArrowRight className="w-4 h-4 ml-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);

const MarketplacePage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    country: 'Nigeria',
    state: '',
    area: ''
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState({
    patient_name: '',
    patient_details: '',
    hospital_location: '',
    quantity: 1
  });

  useEffect(() => {
    fetchMarketplace();
  }, [filters]);

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.listInventory(); 
      setInventory(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      await transactionApi.createRequest({
        ...orderData,
        product: selectedProduct.id,
        blood_bank: selectedProduct.blood_bank,
        source: 'MARKETPLACE'
      });
      setShowOrderModal(false);
      // Reset form
      setOrderData({
        patient_name: '',
        patient_details: '',
        hospital_location: '',
        quantity: 1
      });
      alert('Blood request initialized successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.blood_group.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-32 animate-fade-in">
      {/* Hero Search Section */}
      <div className="relative pt-32 pb-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[0%] right-[-20%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-10">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-glass border border-glass-border rounded-full animate-in fade-in slide-in-from-top-4 duration-700">
             <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary">Live Blood Bank Network</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-text-primary uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Emergency <span className="text-gradient">Blood</span> Search
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 opacity-80">
            Verifying blood availability across the Nigerian healthcare infrastructure. 
            Search by location and blood type to request immediate delivery.
          </p>
          
          <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-glass border border-glass-border rounded-[40px] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="relative md:col-span-2">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-16 bg-transparent border-none pl-16 pr-6 text-text-primary font-black placeholder:text-text-muted focus:ring-0 text-lg"
                placeholder="Search Blood Group (e.g. O+)"
              />
            </div>
            <div className="relative">
              <select 
                className="w-full h-16 bg-glass-border/30 border border-glass-border rounded-2xl px-6 text-text-primary font-black focus:border-accent/50 outline-none appearance-none cursor-pointer"
                value={filters.state}
                onChange={(e) => setFilters({...filters, state: e.target.value})}
              >
                <option value="">All States</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted rotate-90" />
            </div>
            <input 
              type="text" 
              placeholder="Area (e.g. Ikeja)"
              className="w-full h-16 bg-glass-border/30 border border-glass-border rounded-2xl px-6 text-text-primary font-black focus:border-accent/50 outline-none placeholder:text-text-muted/50"
              value={filters.area}
              onChange={(e) => setFilters({...filters, area: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Results Matrix */}
      <div className="max-w-7xl mx-auto -mt-32 px-8 relative z-20 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center bg-glass border border-glass-border px-10 py-6 rounded-[32px] backdrop-blur-3xl shadow-2xl gap-6">
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-4 border-bg-dark bg-glass-border flex items-center justify-center overflow-hidden">
                      <Droplet className={`w-5 h-5 ${i % 2 === 0 ? 'text-accent' : 'text-primary'}`} />
                   </div>
                 ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                <span className="text-text-primary font-black text-sm mr-2">{filteredInventory.length}</span> 
                Verified units synchronized in current cluster
              </p>
           </div>
           <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-accent-hover transition-all bg-accent/10 px-6 py-3 rounded-xl border border-accent/20 group">
              <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Advanced Protocol
           </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div className="p-32 text-center bg-glass rounded-[56px] border border-glass-border backdrop-blur-xl">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
                <Droplet className="absolute inset-0 m-auto w-8 h-8 text-accent animate-pulse" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Synchronizing Biological Matrix...</p>
            </div>
          ) : filteredInventory.length > 0 ? (
            filteredInventory.map(item => {
              const commission = item.commission_percentage || 10;
              const displayPrice = item.price * (1 + commission / 100);
              
              return (
                <BloodCard 
                  key={item.id}
                  group={item.blood_group}
                  product={item}
                  bank={item.blood_bank_details}
                  location={item.blood_bank_details}
                  price={displayPrice}
                  onOrder={(p) => {
                    setSelectedProduct(p);
                    setShowOrderModal(true);
                  }}
                />
              );
            })
          ) : (
            <div className="p-32 text-center bg-glass rounded-[56px] border border-glass-border backdrop-blur-xl">
              <Droplet className="w-20 h-20 text-text-muted mx-auto mb-8 opacity-10" />
              <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">No Biological Match Found</h3>
              <p className="text-text-secondary mt-3 uppercase tracking-widest text-[10px] font-bold opacity-60">Adjust your location protocol or search parameters</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-darker/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowOrderModal(false)} />
          <div className="bg-card-bg border border-glass-border rounded-[64px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setShowOrderModal(false)}
              className="absolute top-10 right-10 p-3 rounded-2xl bg-glass border border-glass-border text-text-secondary hover:text-accent transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-16">
              <div className="flex justify-between items-start mb-16">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Coordination Protocol</span>
                  </div>
                  <h2 className="text-5xl font-black text-text-primary uppercase tracking-tighter leading-none">
                    Request <span className="text-gradient">Order</span>
                  </h2>
                </div>
                <div className="w-24 h-24 bg-accent rounded-[40px] flex flex-col items-center justify-center text-white shadow-2xl shadow-accent/40 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 group-hover:rotate-180 transition-transform duration-1000" />
                  <span className="text-4xl font-black relative z-10">{selectedProduct?.blood_group}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest relative z-10 opacity-80">Biological</span>
                </div>
              </div>

              <form onSubmit={handleOrder} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Patient Identity</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-5 px-8 text-text-primary outline-none focus:border-accent/50 transition-all font-black text-lg placeholder:text-text-muted/30"
                      placeholder="Full Name"
                      value={orderData.patient_name}
                      onChange={(e) => setOrderData({...orderData, patient_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Quantity (Units)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        min="1"
                        className="w-full bg-glass border border-glass-border rounded-2xl py-5 px-8 text-text-primary outline-none focus:border-accent/50 transition-all font-black text-lg"
                        value={orderData.quantity}
                        onChange={(e) => setOrderData({...orderData, quantity: e.target.value})}
                      />
                      <Droplet className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-accent opacity-50" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Hospital Delivery Specifics</label>
                  <input 
                    className="w-full bg-glass border border-glass-border rounded-2xl py-5 px-8 text-text-primary outline-none focus:border-accent/50 transition-all font-black text-lg placeholder:text-text-muted/30"
                    placeholder="Ward, Floor, Facility Name"
                    value={orderData.hospital_location}
                    onChange={(e) => setOrderData({...orderData, hospital_location: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Clinical Justification</label>
                  <textarea 
                    className="w-full bg-glass border border-glass-border rounded-2xl py-5 px-8 text-text-primary outline-none focus:border-accent/50 transition-all font-black text-lg placeholder:text-text-muted/30 min-h-[120px] resize-none"
                    placeholder="Brief clinical notes..."
                    value={orderData.patient_details}
                    onChange={(e) => setOrderData({...orderData, patient_details: e.target.value})}
                  />
                </div>

                <div className="pt-6 space-y-6">
                  <button className="w-full btn btn-primary py-6 rounded-3xl text-sm uppercase font-black tracking-[0.4em] group">
                    Initialize Protocol
                    <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <div className="flex items-center justify-between px-8 py-4 bg-glass border border-glass-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Estimated Payload</span>
                    <span className="text-xl font-black text-text-primary">
                      ₦{((selectedProduct?.price * (1 + (selectedProduct?.commission_percentage || 10) / 100)) * orderData.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;

