import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Droplet, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  User, 
  Receipt,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  Loader2,
  X,
  History,
  Scan,
  HandCoins,
  ShieldCheck,
  ChevronRight,
  Filter,
  Activity,
  Clock,
  LogOut,
  Maximize2
} from 'lucide-react';
import { inventoryApi, transactionApi, adminApi, paymentApi, usersApi } from '../../api';
import { useIsVerified } from '../../hooks/useIsVerified';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const POSItem = ({ item, addToCart, cart, isVerified }) => {
  const isOutOfStock = item.quantity <= 0;
  const inCart = cart.find(c => c.id === item.id);
  const stockPercentage = Math.min((item.quantity / 20) * 100, 100); 
  
  return (
    <motion.div 
      layout
      whileHover={!isOutOfStock && isVerified ? { scale: 1.02, y: -5 } : {}}
      whileTap={!isOutOfStock && isVerified ? { scale: 0.98 } : {}}
      onClick={() => !isOutOfStock && isVerified && addToCart(item)}
      className={`relative group cursor-pointer overflow-hidden rounded-[40px] p-8 border-2 transition-all duration-500 flex flex-col h-[320px]
        ${isOutOfStock || !isVerified ? 'bg-glass/5 border-glass-border grayscale opacity-50' : 
        inCart ? 'bg-accent/10 border-accent shadow-2xl shadow-accent/20' : 'bg-card-bg/60 border-glass-border hover:border-accent/40 shadow-xl'}`}
    >
      <div className="flex justify-between items-start mb-8">
        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-2xl transition-all duration-500 
          ${inCart ? 'bg-accent text-white shadow-xl shadow-accent/40 scale-110' : 
          'bg-glass border border-glass-border text-text-primary'}`}>
          {item.blood_group}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Available</p>
          <p className="text-2xl font-black text-text-primary leading-none tracking-tighter">{item.quantity} Units</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-text-muted">
            <span>Stock Level</span>
            <span className={stockPercentage < 20 ? 'text-accent' : 'text-emerald-500'}>{item.quantity < 5 ? 'CRITICAL' : 'STABLE'}</span>
          </div>
          <div className="h-2 w-full bg-glass rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stockPercentage}%` }}
              className={`h-full ${stockPercentage < 20 ? 'bg-accent' : 'bg-emerald-500'} rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-glass/30 p-6 rounded-3xl border border-glass-border group-hover:border-accent/20 transition-all">
          <div>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Unit Value</p>
            <p className="text-2xl font-black text-text-primary tabular-nums">₦{parseFloat(item.price).toLocaleString()}</p>
          </div>
          
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
            ${inCart ? 'bg-accent text-white rotate-12' : 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white'}`}>
            {inCart ? <CheckCircle2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {(isOutOfStock || !isVerified) && (
        <div className="absolute inset-0 bg-bg-dark/60 backdrop-blur-[2px] flex items-center justify-center z-20">
          <div className={`${isOutOfStock ? 'bg-red-500' : 'bg-accent'} text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-pulse`}>
            {isOutOfStock ? 'Depleted' : 'Verify Facility'}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const BloodBankPOS = () => {
  const isVerified = useIsVerified();
  const [inventory, setInventory] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    fetchUser();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await usersApi.getMe();
      setCurrentUser(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, typesRes] = await Promise.all([
        inventoryApi.listInventory(),
        adminApi.listBloodTypes()
      ]);
      setInventory(invRes.data.results || invRes.data);
      setBloodTypes(typesRes.data.results || typesRes.data);
    } catch (err) {
      toast.error('Sync Failure');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    if (!isVerified) {
      toast.error('Facility verification required');
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.cartQuantity < product.quantity) {
        setCart(cart.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item));
      } else {
        toast.error('Threshold Reached');
      }
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    const existing = cart.find(item => item.id === id);
    if (existing.cartQuantity > 1) {
      setCart(cart.map(item => item.id === id ? { ...item, cartQuantity: item.cartQuantity - 1 } : item));
    } else {
      setCart(cart.filter(item => item.id !== id));
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || !isVerified) return;
    setIsProcessing(true);
    try {
      const items = cart.map(item => ({
        product: item.product,
        blood_type: item.blood_type,
        quantity: item.cartQuantity,
        blood_price: parseFloat(item.price),
        total_amount: parseFloat(item.price) * item.cartQuantity
      }));

      const res = await transactionApi.bulkPosSale({ items });
      const { master_request_id, total_amount } = res.data;

      const paymentInit = await paymentApi.initialize({
        blood_request_id: master_request_id,
        amount: total_amount,
        callback_url: `${window.location.origin}/bloodbank/inventory`
      });

      if (paymentInit.data?.authorization_url) {
        window.location.href = paymentInit.data.authorization_url;
      } else { throw new Error('Gateway Offline'); }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction Aborted');
      setIsProcessing(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.cartQuantity), 0);
  const totalUnits = cart.reduce((a, b) => a + b.cartQuantity, 0);

  const displayInventory = bloodTypes.map(type => {
    const invItem = inventory.find(inv => inv.blood_type === type.id || inv.blood_group === type.group);
    return invItem ? invItem : { id: `v-${type.id}`, blood_type: type.id, blood_group: type.group, price: type.base_price, quantity: 0, product: null };
  });

  const filteredInventory = displayInventory.filter(item => item.blood_group.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-screen bg-bg-darker text-text-primary flex flex-col overflow-hidden font-main relative">
      {/* POS Top Header */}
      <header className="h-24 bg-card-bg/40 backdrop-blur-3xl border-b border-glass-border px-12 flex items-center justify-between shrink-0 relative z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 group">
             <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/40 group-hover:rotate-12 transition-transform duration-500">
                <Droplet className="w-7 h-7 text-white fill-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Swift<span className="text-accent">POS</span></h1>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1">Terminal Active</p>
             </div>
          </div>
          <div className="h-10 w-px bg-glass-border mx-2" />
          <div className="flex items-center gap-4 bg-glass border border-glass-border px-6 py-2.5 rounded-2xl">
             <Clock className="w-4 h-4 text-accent" />
             <span className="text-xs font-black uppercase tracking-widest tabular-nums">
               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5 px-6 py-2.5 bg-glass border border-glass-border rounded-[24px] hover:border-accent/30 transition-all">
             <div className="text-right">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Authenticated Operator</p>
                <p className="text-sm font-black text-text-primary uppercase tracking-tight">{currentUser?.first_name || 'Admin'} {currentUser?.last_name?.[0]}.</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-inner">
                <User className="w-6 h-6 text-accent" />
             </div>
          </div>
          <button className="p-4 hover:bg-glass rounded-2xl text-text-muted hover:text-accent transition-all border border-transparent hover:border-glass-border shadow-xl">
             <Maximize2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { localStorage.clear(); window.location.href='/login'; }}
            className="p-4 hover:bg-red-500/10 rounded-2xl text-text-muted hover:text-red-500 transition-all border border-transparent hover:border-red-500/20 shadow-xl"
          >
             <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Interface */}
        <div className="flex-1 flex flex-col p-12 gap-10 overflow-hidden min-w-0 bg-gradient-to-br from-bg-darker to-bg-dark">
          {/* Search Bar */}
          <div className="relative group shrink-0 max-w-4xl mx-auto w-full">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-8 h-8 text-text-muted group-focus-within:text-accent transition-all" />
            <input 
              type="text" 
              placeholder="Search Blood Group Node..."
              className="w-full bg-glass/20 border-2 border-glass-border rounded-[32px] py-8 pl-24 pr-10 text-2xl font-black placeholder:text-text-muted/20 outline-none focus:border-accent/50 focus:bg-accent/5 transition-all shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Product Catalog */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <div key={i} className="h-[320px] bg-glass/10 rounded-[40px] animate-pulse border border-glass-border" />
                ))
              ) : filteredInventory.map(item => (
                <POSItem key={item.id} item={item} addToCart={addToCart} cart={cart} isVerified={isVerified} />
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar (Receipt Style) */}
        <div className="w-[500px] bg-bg-darker border-l border-glass-border p-10 flex flex-col gap-8 relative z-50">
          {/* Receipt Container */}
          <div className="flex-1 bg-white flex flex-col rounded-[32px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative border border-white/20">
             <div className="p-10 border-b-2 border-dashed border-gray-200 bg-gray-50/50">
                <div className="text-center space-y-4">
                   <div className="inline-block px-4 py-1 bg-gray-900 text-white rounded-full text-[8px] font-black uppercase tracking-[0.3em]">Official Invoice</div>
                   <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Settlement Summary</h2>
                   <div className="flex justify-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>ID: POS-{Math.floor(Math.random()*100000)}</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                   </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar text-gray-900 bg-white">
                <AnimatePresence initial={false}>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 text-gray-900 scale-125">
                       <ShoppingCart className="w-24 h-24 mb-6" />
                       <p className="text-[12px] font-black uppercase tracking-[0.5em]">Terminal Idle</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex justify-between items-start gap-6 group"
                      >
                        <div className="flex-1">
                           <p className="font-black text-lg uppercase leading-tight group-hover:text-accent transition-colors">{item.blood_group} BLOOD UNIT</p>
                           <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-widest">₦{parseFloat(item.price).toLocaleString()} × {item.cartQuantity}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-3">
                           <p className="font-black text-lg tracking-tight">₦{(parseFloat(item.price) * item.cartQuantity).toLocaleString()}</p>
                           <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                              <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center hover:bg-white hover:text-accent rounded-lg transition-all shadow-sm"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="text-[11px] font-black w-6 text-center tabular-nums">{item.cartQuantity}</span>
                              <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center hover:bg-white hover:text-accent rounded-lg transition-all shadow-sm"><Plus className="w-3.5 h-3.5" /></button>
                           </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
             </div>

             {/* Total Area */}
             <div className="p-10 bg-gray-50 border-t-2 border-dashed border-gray-200 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-b from-gray-200/50 to-transparent" />
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     <span>Fulfillment Volume ({totalUnits} Units)</span>
                     <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     <span>Platform Transaction Fee</span>
                     <span className="text-emerald-600 font-black">EXEMPT</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Payable Amount</p>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">Settlement Value</p>
                   </div>
                   <p className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">₦{totalAmount.toLocaleString()}</p>
                </div>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-5 relative z-50">
            <button 
              disabled={cart.length === 0 || isProcessing || !isVerified}
              onClick={handleCheckout}
              className={`w-full py-8 rounded-[32px] shadow-2xl flex items-center justify-center gap-6 group transition-all active:scale-95 relative overflow-hidden ${!isVerified ? 'bg-glass-border/40 text-text-muted cursor-not-allowed grayscale' : 'bg-emerald-500 text-white shadow-emerald-500/40 hover:bg-emerald-600 disabled:opacity-50'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isProcessing ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-[0.4em]">{!isVerified ? 'VERIFICATION REQUIRED' : 'Finalize Settlement'}</span>
                </>
              )}
            </button>
            <button 
              onClick={() => setCart([])}
              disabled={cart.length === 0 || !isVerified}
              className={`w-full bg-glass border border-glass-border py-5 rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${!isVerified ? 'opacity-20 cursor-not-allowed' : 'text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5'}`}
            >
              <Trash2 className="w-4 h-4" />
              Discard Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/5 blur-[200px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[180px] rounded-full pointer-events-none z-0" />
    </div>
  );
};

export default BloodBankPOS;
