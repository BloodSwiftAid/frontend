import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Search, 
  ChevronRight, 
  Droplet, 
  Filter, 
  Loader2, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inventoryApi, transactionApi, usersApi } from '../../api';
import { toast } from 'react-hot-toast';

const BloodCard = ({ group, product, bank, location, price, onOrder }) => (
  <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 md:p-8 rounded-3xl md:rounded-[40px] hover:border-primary/40 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5">
    <div className="absolute top-0 right-0 p-4 md:p-6">
      <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
        Available
      </div>
    </div>
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
      <div className="w-20 h-20 md:w-28 md:h-28 bg-primary rounded-2xl md:rounded-[32px] flex flex-col items-center justify-center text-white shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
        <span className="text-3xl md:text-4xl font-black relative z-10">{group}</span>
        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-80 relative z-10">Unit</span>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">{bank?.name || 'Authorized Bank'}</h3>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mt-3 md:mt-4">
          <span className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary">
            <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
            {location?.area || 'Central'}, {location?.state || 'Lagos'}
          </span>
          <span className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary">
            <Navigation className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
            {location?.street || 'Main St'}
          </span>
        </div>
      </div>
      <div className="w-full md:w-auto text-center md:text-right space-y-4 md:space-y-6">
        <div>
          <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Unit Price</p>
          <p className="text-2xl md:text-3xl font-black text-text-primary">₦{price?.toLocaleString()}</p>
        </div>
        <button 
          onClick={() => onOrder(product)}
          className="w-full md:w-auto btn btn-primary px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl group/btn"
        >
          <span className="font-black uppercase tracking-widest text-xs">Request</span>
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
      setOrderData({
        patient_name: '',
        patient_details: '',
        hospital_location: '',
        quantity: 1
      });
      toast.success('Order Initiated');
    } catch (err) {
      toast.error('Network Error');
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.blood_group.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 md:pb-32 animate-fade-in">
      {/* Hero Section */}
      <div className="relative pt-24 md:pt-32 pb-48 md:pb-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[0%] right-[-20%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <div className="container max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8 md:space-y-10">
          <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 bg-glass border border-glass-border rounded-full animate-fade-in">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-text-primary">Live Inventory Network</span>
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-text-primary uppercase leading-tight md:leading-[0.9]">
            Emergency <span className="text-gradient">Blood</span> Access
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed opacity-80">
            Real-time verification of blood inventory across the healthcare infrastructure.
          </p>
          
          <div className="max-w-4xl mx-auto mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-5 bg-glass border border-glass-border rounded-3xl md:rounded-[40px] shadow-2xl">
            <div className="relative md:col-span-2">
              <Search className="absolute left-6 md:left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 md:h-16 bg-transparent border-none pl-14 md:pl-16 pr-6 text-text-primary font-black placeholder:text-text-muted focus:ring-0 text-base md:text-lg"
                placeholder="Blood Type (e.g. O+)"
              />
            </div>
            <div className="relative">
              <select 
                className="w-full h-14 md:h-16 bg-glass-border/30 border border-glass-border rounded-xl md:rounded-2xl px-6 text-text-primary font-black focus:border-primary/50 outline-none appearance-none cursor-pointer text-sm"
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
              placeholder="Area Search"
              className="w-full h-14 md:h-16 bg-glass-border/30 border border-glass-border rounded-xl md:rounded-2xl px-6 text-text-primary font-black focus:border-primary/50 outline-none placeholder:text-text-muted/50 text-sm"
              value={filters.area}
              onChange={(e) => setFilters({...filters, area: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Results Overview */}
      <div className="container max-w-7xl mx-auto -mt-24 md:-mt-32 px-6 relative z-20 space-y-8 md:space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center bg-glass border border-glass-border px-8 md:px-10 py-6 rounded-3xl md:rounded-[32px] backdrop-blur-3xl shadow-2xl gap-6">
           <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden sm:flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-bg-dark bg-glass-border flex items-center justify-center overflow-hidden">
                      <Droplet className={`w-4 h-4 md:w-5 md:h-5 ${i % 2 === 0 ? 'text-primary' : 'text-accent'}`} />
                   </div>
                 ))}
              </div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                <span className="text-text-primary font-black text-sm mr-2">{filteredInventory.length}</span> 
                Blood banks found in active network
              </p>
           </div>
           <button className="w-full md:w-auto flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white hover:bg-primary transition-all bg-primary/10 px-6 py-3 rounded-xl border border-primary/20">
              <Filter className="w-4 h-4" />
              Advanced
           </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {loading ? (
            <div className="p-20 md:p-32 text-center bg-glass rounded-3xl md:rounded-[56px] border border-glass-border backdrop-blur-xl">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Updating Inventory...</p>
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
            <div className="p-20 md:p-32 text-center bg-glass rounded-3xl md:rounded-[56px] border border-glass-border backdrop-blur-xl">
              <Droplet className="w-16 h-16 text-text-muted mx-auto mb-8 opacity-10" />
              <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tighter">No matching blood type</h3>
              <p className="text-text-secondary mt-3 uppercase tracking-widest text-[10px] font-bold opacity-60">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Order Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-darker/95 backdrop-blur-3xl" 
              onClick={() => setShowOrderModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card-bg border border-glass-border rounded-3xl md:rounded-[64px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setShowOrderModal(false)}
                className="absolute top-6 md:top-10 right-6 md:right-10 p-2 md:p-3 rounded-xl md:rounded-2xl bg-glass border border-glass-border text-text-secondary hover:text-primary transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-16">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 md:mb-16 gap-8">
                  <div className="space-y-4 text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Request Details</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-text-primary uppercase tracking-tighter leading-none">
                      Request <span className="text-gradient">Order</span>
                    </h2>
                  </div>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-3xl md:rounded-[40px] flex flex-col items-center justify-center text-white shadow-2xl shadow-primary/40 relative overflow-hidden shrink-0">
                    <span className="text-3xl md:text-4xl font-black relative z-10">{selectedProduct?.blood_group}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest relative z-10 opacity-80">Blood Group</span>
                  </div>
                </div>

                <form onSubmit={handleOrder} className="space-y-8 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Patient Name</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl py-4 md:py-5 px-6 md:px-8 text-text-primary outline-none focus:border-primary/50 transition-all font-black text-base md:text-lg"
                        placeholder="Required"
                        value={orderData.patient_name}
                        onChange={(e) => setOrderData({...orderData, patient_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Units Required</label>
                      <div className="relative">
                        <input 
                          type="number"
                          min="1"
                          className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl py-4 md:py-5 px-6 md:px-8 text-text-primary outline-none focus:border-primary/50 transition-all font-black text-base md:text-lg"
                          value={orderData.quantity}
                          onChange={(e) => setOrderData({...orderData, quantity: e.target.value})}
                        />
                        <Droplet className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Facility Details</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl py-4 md:py-5 px-6 md:px-8 text-text-primary outline-none focus:border-primary/50 transition-all font-black text-base md:text-lg"
                      placeholder="Ward, Facility Name"
                      value={orderData.hospital_location}
                      onChange={(e) => setOrderData({...orderData, hospital_location: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Notes</label>
                    <textarea 
                      className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl py-4 md:py-5 px-6 md:px-8 text-text-primary outline-none focus:border-primary/50 transition-all font-black text-base md:text-lg min-h-[100px] md:min-h-[120px] resize-none"
                      placeholder="Clinical details..."
                      value={orderData.patient_details}
                      onChange={(e) => setOrderData({...orderData, patient_details: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 md:pt-6 space-y-6">
                    <button className="w-full btn btn-primary py-5 md:py-6 rounded-2xl md:rounded-3xl text-xs md:text-sm uppercase font-black tracking-[0.4em] group">
                      Confirm Request
                      <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-glass border border-glass-border rounded-xl md:rounded-2xl">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted">Est. Settlement</span>
                      <span className="text-lg md:text-xl font-black text-text-primary">
                        ₦{((selectedProduct?.price * (1 + (selectedProduct?.commission_percentage || 10) / 100)) * orderData.quantity).toLocaleString()}
                      </span>
                    </div>
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

export default MarketplacePage;
