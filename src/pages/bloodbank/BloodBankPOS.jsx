import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  ShoppingCart, 
  User, 
  LogOut, 
  Search, 
  Plus, 
  Minus, 
  X, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  Clock,
  ArrowRight,
  Receipt,
  CreditCard,
  AlertCircle,
  Activity,
  Zap,
  Box,
  Banknote,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inventoryApi, transactionApi, paymentApi, usersApi, adminApi } from '../../api';
import { useIsVerified } from '../../hooks/useIsVerified';
import { toast } from 'react-hot-toast';

const POSItem = ({ item, addToCart, removeFromCart, cart, isVerified }) => {
  const isOutOfStock = item.quantity <= 0;
  const inCart = cart.find(c => c.id === item.id);
  const isNegative = item.blood_group.includes('-');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 rounded-[32px] border-2 transition-all duration-300 flex flex-col gap-6 h-full
        ${isOutOfStock ? 'bg-slate-50 border-slate-200 opacity-60' : 
        inCart ? 'bg-white border-primary shadow-2xl ring-1 ring-primary/20' : 
        'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/30'}`}
    >
      {/* Type Badge */}
      <div className="flex justify-between items-start">
        <div className={`px-4 py-2 rounded-2xl text-sm font-black text-white shadow-lg
          ${isOutOfStock ? 'bg-slate-400' : isNegative ? 'bg-accent' : 'bg-primary'}`}>
          {item.blood_group}
        </div>
        {inCart && (
          <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <CheckCircle2 size={16} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Price & Info */}
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-black text-slate-900 tracking-tighter">
          ₦{parseFloat(item.price).toLocaleString()}
        </span>
        <div className="flex items-center gap-2 mt-2">
           <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOutOfStock ? 'bg-accent' : 'bg-emerald-500 animate-pulse'}`} />
           <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${isOutOfStock ? 'text-accent' : 'text-slate-400'}`}>
             {isOutOfStock ? 'Sold Out' : `${item.quantity} ${item.quantity === 1 ? 'Unit' : 'Units'} Left`}
           </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-4 border-t border-slate-50">
        {!inCart ? (
          <button 
            disabled={isOutOfStock || !isVerified}
            onClick={() => addToCart(item)}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-black uppercase tracking-widest text-[11px]
              ${isOutOfStock ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
                'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/10 active:scale-95'}`}
          >
            {isOutOfStock ? 'Empty' : 'Add to Order'}
          </button>
        ) : (
          <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 p-1 rounded-xl w-full">
            <button 
              onClick={() => removeFromCart(item.id)}
              className="w-6 h-6 flex items-center justify-center bg-white text-slate-400 hover:text-accent shadow-xs rounded-md transition-all"
            >
              <Minus size={10} strokeWidth={3} />
            </button>
            <div className="flex flex-col items-center">
               <span className="text-xs font-black text-slate-900 tabular-nums leading-none">{inCart.cartQuantity}</span>
               <span className="text-[5px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5">Order</span>
            </div>
            <button 
              onClick={() => addToCart(item)}
              className="w-6 h-6 flex items-center justify-center bg-white text-slate-400 hover:text-primary shadow-xs rounded-md transition-all"
            >
              <Plus size={10} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {/* Verification Guard */}
      {!isVerified && !isOutOfStock && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-[32px] p-6 text-center">
           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 border border-primary/20">
              <ShieldCheck size={24} className="text-primary" />
           </div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Facility Unverified</p>
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
  const [paymentMethod, setPaymentMethod] = useState('transfer'); // transfer, pos, cash
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      toast.error('Verification Required');
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.cartQuantity < product.quantity) {
        setCart(cart.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item));
      } else {
        toast.error('Limit Reached');
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

      const res = await transactionApi.bulkPosSale({ 
        items,
        payment_method: paymentMethod 
      });

      const { master_request_id, total_amount } = res.data;

      if (paymentMethod === 'transfer') {
        const paymentInit = await paymentApi.initialize({
          blood_request_id: master_request_id,
          amount: total_amount,
          callback_url: `${window.location.origin}/bloodbank/inventory`
        });

        if (paymentInit.data?.authorization_url) {
          window.location.href = paymentInit.data.authorization_url;
        } else { throw new Error('Gateway Error'); }
      } else {
        // Cash or POS: Direct success
        setCart([]);
        toast.success(`Transaction Completed via ${paymentMethod.toUpperCase()}`);
        setIsProcessing(false);
        fetchData();
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Check failed');
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
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Tech Header */}
      <header className="h-24 bg-card-bg/40 backdrop-blur-3xl border-b border-glass-border px-6 md:px-12 flex items-center justify-between shrink-0 relative z-[100]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Droplet className="w-8 h-8 text-primary fill-primary relative z-10" />
             </div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 text-text-primary">
                  Swift<span className="text-primary">CORE</span>
                  <span className="px-2 py-0.5 bg-primary text-bg-dark text-[10px] rounded font-black tracking-widest">POS v2.0</span>
                </h1>
             </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 pl-10 border-l border-glass-border/30">
             <div className="flex flex-col">
                <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Network Status</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Updated</span>
                </div>
             </div>
             <div className="flex flex-col">
                <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Session Time</p>
                <span className="text-[10px] font-black uppercase tracking-widest tabular-nums text-text-secondary">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 px-5 py-3 bg-glass border border-glass-border rounded-2xl">
             <div className="text-right">
                <p className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Technician</p>
                <p className="text-sm font-black text-text-primary uppercase tracking-tight">{currentUser?.first_name || 'Admin'}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User size={18} className="text-primary" />
             </div>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="lg:hidden relative p-4 bg-primary text-bg-dark rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-90"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-bg-dark text-[11px] font-black rounded-full flex items-center justify-center shadow-xl border-2 border-bg-darker">
                {totalUnits}
              </span>
            )}
          </button>

          <button 
            onClick={() => { localStorage.clear(); window.location.href='/login'; }}
            className="p-4 hover:bg-accent/10 rounded-2xl text-text-muted hover:text-accent transition-all"
          >
             <LogOut size={24} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Intelligence Grid */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="p-6 md:p-8 lg:p-12 flex flex-col gap-8 flex-1 overflow-hidden">
            {/* Command Bar */}
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted group-focus-within:text-primary transition-all duration-300" />
                <input 
                  type="text" 
                  placeholder="Search blood group..."
                  className="w-full bg-glass/10 border border-glass-border rounded-[32px] py-6 pl-20 pr-8 text-xl font-black placeholder:text-text-muted/30 outline-none focus:border-primary/40 focus:bg-bg-dark/40 transition-all shadow-2xl shadow-black/10 backdrop-blur-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4 shrink-0">
                <button className="px-10 py-6 bg-primary text-bg-dark rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">All Blood Groups</button>
                <button className="px-10 py-6 bg-glass/10 border border-glass-border text-text-muted rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-glass/20 transition-all">Priority</button>
              </div>
            </div>

            {/* Neural Grid */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
                {loading ? (
                  Array(10).fill(0).map((_, i) => (
                    <div key={i} className="h-32 bg-glass/10 rounded-[32px] animate-pulse border border-glass-border" />
                  ))
                ) : filteredInventory.map(item => (
                  <POSItem key={item.id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} isVerified={isVerified} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Digital Ledger / Receipt Panel */}
        <aside className="hidden lg:flex w-[450px] bg-card-bg/30 backdrop-blur-3xl border-l border-glass-border/30 flex-col relative z-50">
          <div className="p-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <Receipt className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-tighter text-text-primary">Digital Ledger</h2>
              </div>
              <button 
                onClick={() => setCart([])}
                className="text-[10px] font-black text-text-muted hover:text-accent uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} />
                Flush
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar mb-10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 opacity-30">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center border-2 border-dashed border-primary/20 animate-pulse">
                      <Box size={48} className="text-primary/40" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-bg-dark border border-glass-border rounded-2xl flex items-center justify-center shadow-2xl">
                      <Zap size={20} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-text-muted max-w-[220px] leading-relaxed">
                    System Standby.<br/>Select blood groups to begin.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={item.id} 
                      className="p-6 bg-glass/10 border border-glass-border rounded-[32px] group relative overflow-hidden hover:border-primary/30 transition-all"
                    >
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex gap-5 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl ${item.blood_group.includes('-') ? 'bg-accent shadow-accent/20' : 'bg-primary shadow-primary/20'}`}>
                          {item.blood_group}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest truncate">Blood Unit</p>
                            <p className="text-sm font-black text-primary tabular-nums">₦{(parseFloat(item.price) * item.cartQuantity).toLocaleString()}</p>
                          </div>
                          <p className="text-sm font-black text-text-primary mb-4 tracking-tight">₦{parseFloat(item.price).toLocaleString()} <span className="text-[10px] text-text-muted px-1">/ UNIT</span></p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 bg-bg-darker/60 border border-glass-border p-1.5 rounded-xl backdrop-blur-md">
                              <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center hover:bg-accent/20 hover:text-accent rounded-lg transition-all text-text-muted"><Minus size={14} /></button>
                              <span className="text-xs font-black w-4 text-center tabular-nums text-text-primary">{item.cartQuantity}</span>
                              <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center hover:bg-primary/20 hover:text-primary rounded-lg transition-all text-text-muted"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/10 rounded-xl transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="bg-glass/5 border border-glass-border rounded-3xl p-4 mb-6">
              <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-3 px-2">Settlement Channel</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'transfer', label: 'Transfer', icon: Receipt },
                  { id: 'pos', label: 'POS Terminal', icon: CreditCard },
                  { id: 'cash', label: 'Cash Flow', icon: Banknote }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-2 py-3 rounded-2xl border transition-all ${paymentMethod === method.id ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-glass border-glass-border hover:border-primary/30'}`}
                  >
                    <method.icon size={16} className={paymentMethod === method.id ? 'text-bg-dark' : 'text-primary'} />
                    <span className={`text-[8px] font-black uppercase tracking-widest ${paymentMethod === method.id ? 'text-bg-dark' : 'text-text-secondary'}`}>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Settlement Matrix */}
            <div className="mt-auto space-y-8 pt-10 border-t border-glass-border/30">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-2">
                  <span>Total Units ({totalUnits})</span>
                  <span className="text-text-primary tabular-nums">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-2">
                  <span>Network Processing</span>
                  <span className="text-primary tracking-[0.4em]">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between items-end pt-8 mt-2 border-t border-glass-border/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted mb-2">Net Settlement</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20 w-fit">Authorized</span>
                  </div>
                  <span className="text-5xl font-black text-text-primary tracking-tighter tabular-nums">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  disabled={cart.length === 0 || isProcessing || !isVerified}
                  onClick={handleCheckout}
                  className={`w-full py-7 rounded-[32px] flex items-center justify-center gap-4 font-black uppercase tracking-[0.5em] text-[11px] transition-all shadow-2xl relative overflow-hidden group
                    ${!isVerified ? 'bg-glass border border-glass-border text-text-muted cursor-not-allowed' : 
                      cart.length === 0 ? 'bg-glass border border-glass-border text-text-primary opacity-40 cursor-not-allowed' :
                      'bg-primary text-bg-dark shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02]'}`}
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  {isProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck size={20} className={isVerified ? 'text-bg-dark' : 'text-text-muted'} />
                      <span className="relative z-10">{isVerified ? 'Execute Transaction' : 'Verify Facility'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Command Center */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="fixed inset-0 bg-bg-dark/80 backdrop-blur-md z-[200] lg:hidden"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 max-h-[90vh] bg-bg-dark border-t border-glass-border rounded-t-[50px] flex flex-col z-[250] lg:hidden overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
              >
                <div className="h-1.5 w-16 bg-glass/20 rounded-full mx-auto my-6 shrink-0" />
                <div className="p-8 pt-2 flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-text-primary flex items-center gap-3">
                      <ShoppingCart className="text-primary" />
                      Active Ledger
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 rounded-full bg-glass/20 flex items-center justify-center border border-glass-border">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto mb-8 pr-2 custom-scrollbar space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-5 p-6 bg-glass border border-glass-border rounded-[32px]">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg ${item.blood_group.includes('-') ? 'bg-accent' : 'bg-primary'}`}>
                          {item.blood_group}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <p className="text-sm font-black text-text-primary">Blood Unit</p>
                            <p className="text-sm font-black text-primary">₦{(parseFloat(item.price) * item.cartQuantity).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5 bg-bg-darker border border-glass-border p-2 rounded-xl">
                              <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 flex items-center justify-center bg-bg-dark rounded-lg"><Minus size={16} /></button>
                              <span className="text-sm font-black tabular-nums text-text-primary">{item.cartQuantity}</span>
                              <button onClick={() => addToCart(item)} className="w-10 h-10 flex items-center justify-center bg-bg-dark rounded-lg"><Plus size={16} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 pb-8">
                    <div className="flex justify-between items-end border-t border-glass-border/30 pt-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-1">Total Authorized</span>
                        <span className="text-xs font-black text-primary uppercase tracking-widest">Digital Ledger</span>
                      </div>
                      <span className="text-4xl font-black text-text-primary tracking-tighter">₦{totalAmount.toLocaleString()}</span>
                    </div>
                    <button 
                      disabled={cart.length === 0 || isProcessing || !isVerified}
                      onClick={handleCheckout}
                      className="w-full py-6 bg-primary text-bg-dark rounded-[28px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/20"
                    >
                      Authorize Transaction
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BloodBankPOS;

