import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Search, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Zap,
  Info,
  Loader2,
  CheckCircle2,
  Filter,
  TrendingUp,
  Package,
  X,
  AlertCircle,
  ShieldAlert,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inventoryApi, transactionApi, paymentApi, usersApi } from '../../../services/api';
import { useIsVerified } from '../../../shared/hooks/useIsVerified';
import { toast } from 'react-hot-toast';

const HospitalMarketplace = () => {
  const isVerified = useIsVerified();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // { blood_type_id: quantity }
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Location states
  const [locations, setLocations] = useState({ countries: [], states: [], cities: [] });
  const [filters, setFilters] = useState({ country: '', state: '', city: '' });

  useEffect(() => {
    fetchLocations();
    fetchUser();
  }, []);

  useEffect(() => {
    fetchMarketplace();
  }, [filters]);

  const fetchLocations = async () => {
    try {
      const res = await inventoryApi.getMarketplaceLocations();
      setLocations(res.data);
    } catch (err) {
      console.error('Failed to fetch location filters');
    }
  };

  const fetchUser = async () => {
    try {
      const res = await usersApi.getMe();
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile');
    }
  };

  const fetchMarketplace = async () => {
    try {
      const params = {};
      if (filters.country) params.country = filters.country;
      if (filters.state) params.state = filters.state;
      if (filters.city) params.city = filters.city;
      
      const response = await inventoryApi.getMarketplace(params);
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setCart({}); // Reset cart on filter change to prevent inconsistent state
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'country' && !value) {
        updated.state = '';
        updated.city = '';
      }
      if (key === 'state' && !value) {
        updated.city = '';
      }
      return updated;
    });
  };


  const updateCart = (id, delta, max) => {
    if (!isVerified) {
      toast.error('Verification required to interact with marketplace');
      return;
    }
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(max, current + delta));
      if (next === 0 && delta < 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      if (next > current && current >= max) {
        toast.error('Maximum available units reached');
        return prev;
      }
      return { ...prev, [id]: next };
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((acc, [id, qty]) => {
      const item = items.find(i => i.id === parseInt(id));
      return acc + (item?.total_price || 0) * qty;
    }, 0);
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0 || !isVerified) return;
    
    setProcessingOrder(true);
    try {
      const itemsToOrder = Object.entries(cart).map(([id, qty]) => {
        const item = items.find(i => i.id === parseInt(id));
        return {
          blood_type: item.id,
          quantity: qty,
          source: 'MARKETPLACE'
        };
      });

      const res = await transactionApi.bulkCreate({ items: itemsToOrder });
      const { master_request_id } = res.data;
      const totalAmount = calculateTotal();

      const paymentInit = await paymentApi.initialize({
        blood_request_id: master_request_id,
        amount: totalAmount,
        callback_url: `${window.location.origin}/hospital/transactions`
      });

      if (paymentInit.data?.authorization_url) {
        toast.loading('Redirecting to secure gateway...');
        window.location.href = paymentInit.data.authorization_url;
      } else {
        throw new Error('No authorization URL received');
      }

    } catch (error) {
      toast.error('Error: Order could not be initialized');
      setProcessingOrder(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || (activeFilter === 'LOW' && item.available_units < 10 && item.available_units > 0);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-accent animate-spin" />
          <Droplet className="w-6 h-6 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted animate-pulse">Updating Global Inventory...</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-glass-border pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                <span className="text-[9px] font-black text-accent uppercase tracking-widest">Network Active</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Operational</span>
             </div>
             {!isVerified && (
               <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full animate-pulse">
                 <ShieldAlert className="w-3 h-3 text-amber-500" />
                 <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Verification Pending</span>
               </div>
             )}
          </div>
          <h1 className="text-6xl font-black tracking-tight text-text-primary uppercase leading-none">
            Market<span className="text-gradient">place</span>
          </h1>
          <p className="text-text-secondary max-w-xl font-bold uppercase tracking-widest text-[10px] leading-relaxed opacity-60">
            Secure procurement portal for blood inventory. Real-time updates across all verified blood banks.
          </p>
        </div>

        <div className="flex gap-4">
           <div className="bg-glass border border-glass-border p-6 rounded-[32px] flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                 <Package className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Total Supply</p>
                 <h4 className="text-2xl font-black text-text-primary">{items.reduce((acc, i) => acc + i.available_units, 0)} Units</h4>
              </div>
           </div>
        </div>
      </header>

      {/* Modern Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            className="w-full bg-card-bg/30 backdrop-blur-xl border border-glass-border rounded-2xl py-5 pl-16 pr-8 text-text-primary font-bold uppercase tracking-widest text-xs outline-none focus:border-accent/50 transition-all shadow-sm" 
            placeholder="Search blood group..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1.5 bg-glass border border-glass-border rounded-2xl">
           {['ALL', 'LOW'].map(filter => (
             <button 
               key={filter}
               onClick={() => setActiveFilter(filter)}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeFilter === filter ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
             >
               {filter}
             </button>
           ))}
         </div>
      </div>

      {/* Location Filter Bar */}
      <div className="bg-card-bg/25 backdrop-blur-xl border border-glass-border p-6 rounded-[28px] grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-sm">
        {/* Country Select */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] pl-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-accent" />
            Country
          </label>
          <div className="relative">
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full bg-glass border border-glass-border rounded-xl py-3.5 pl-4 pr-10 text-text-primary font-bold uppercase tracking-widest text-[10px] outline-none focus:border-accent/40 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-bg-darker text-text-muted">All Countries</option>
              {locations.countries.map(c => (
                <option key={c} value={c} className="bg-bg-darker text-text-primary">{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* State Select */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] pl-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-accent" />
            State
          </label>
          <div className="relative">
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full bg-glass border border-glass-border rounded-xl py-3.5 pl-4 pr-10 text-text-primary font-bold uppercase tracking-widest text-[10px] outline-none focus:border-accent/40 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-bg-darker text-text-muted">All States</option>
              {locations.states.map(s => (
                <option key={s} value={s} className="bg-bg-darker text-text-primary">{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* City Select */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] pl-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-accent" />
            City / Area
          </label>
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full bg-glass border border-glass-border rounded-xl py-3.5 pl-4 pr-10 text-text-primary font-bold uppercase tracking-widest text-[10px] outline-none focus:border-accent/40 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-bg-darker text-text-muted">All Cities</option>
              {locations.cities.map(c => (
                <option key={c} value={c} className="bg-bg-darker text-text-primary">{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id} 
              className={`group relative bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[40px] p-8 hover:border-accent/30 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl hover:shadow-accent/5 overflow-hidden ${!isVerified ? 'grayscale opacity-60' : ''}`}
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none group-hover:scale-110">
                <Droplet className="w-40 h-40 text-accent" />
              </div>
              
              <div className="relative z-10 flex flex-col flex-1 space-y-8">
                {/* Card Header: Blood Type Box */}
                <div className="flex flex-col gap-3">
                  <div className="w-full h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-accent font-black text-3xl shadow-inner tracking-tight">
                    {item.group}
                  </div>
                  {item.available_units > 0 ? (
                    <div className="w-full px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{item.available_units} Units Available</span>
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Price Section */}

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-60">Price per unit</p>
                  <h3 className="text-4xl font-black text-text-primary tracking-tighter">
                    ₦{item.total_price.toLocaleString()}
                  </h3>
                </div>

                {/* Selection Section */}
                <div className="mt-auto pt-8 border-t border-glass-border space-y-6">
                  <div className="flex items-center justify-between p-1.5 bg-glass border border-glass-border rounded-2xl">
                    <button 
                      onClick={() => updateCart(item.id, -1, item.available_units)}
                      disabled={!cart[item.id] || !isVerified}
                      className="w-11 h-11 flex items-center justify-center hover:bg-accent/10 text-text-muted hover:text-accent rounded-xl transition-all disabled:opacity-20"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-black text-text-primary tabular-nums">{cart[item.id] || 0}</span>
                    <button 
                      onClick={() => updateCart(item.id, 1, item.available_units)}
                      disabled={item.available_units === 0 || !isVerified}
                      className="w-11 h-11 flex items-center justify-center hover:bg-accent/10 text-text-muted hover:text-accent rounded-xl transition-all disabled:opacity-20"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => updateCart(item.id, 1, item.available_units)}
                    disabled={item.available_units === 0 || cart[item.id] > 0 || !isVerified}
                    className={`w-full py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 ${
                      cart[item.id] > 0 
                      ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                      : 'bg-accent text-white shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 disabled:bg-glass-border/30 disabled:text-text-muted disabled:shadow-none'
                    }`}
                  >
                    {!isVerified ? (
                      <>
                        <ShieldAlert className="w-4 h-4" />
                        Verification Required
                      </>
                    ) : cart[item.id] > 0 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary Bar */}
      <AnimatePresence>
        {Object.keys(cart).length > 0 && isVerified && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-3xl px-6"
          >
            <div className="bg-bg-darker/90 backdrop-blur-2xl border border-glass-border p-6 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex items-center justify-between gap-8">
              <div className="flex items-center gap-6 pl-2">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white relative shadow-lg shadow-accent/20">
                   <ShoppingCart className="w-6 h-6" />
                   <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-text-primary text-bg-darker rounded-full flex items-center justify-center text-[9px] font-black border-2 border-bg-darker">
                      {Object.values(cart).reduce((a, b) => a + b, 0)}
                   </div>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Order Total</p>
                  <h3 className="text-2xl font-black text-text-primary">₦{calculateTotal().toLocaleString()}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setCart({})}
                   className="p-4 text-text-muted hover:text-accent transition-colors"
                 >
                   <X className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleCheckout}
                   disabled={processingOrder}
                   className="btn btn-primary px-10 py-4 rounded-2xl flex items-center gap-4 group shadow-lg shadow-accent/20"
                 >
                   {processingOrder ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                     <>
                        <span className="font-black uppercase tracking-widest text-[10px]">Pay</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </>
                   )}
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HospitalMarketplace;
