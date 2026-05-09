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
  X
} from 'lucide-react';
import { inventoryApi, transactionApi, adminApi, paymentApi, usersApi } from '../../api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryCard = ({ item, cart, setCart }) => {
  const [cardQty, setCardQty] = useState(item.quantity > 0 ? 1 : 0);
  const displayPrice = parseFloat(item.price);
  const isOutOfStock = item.quantity <= 0;
  
  return (
    <div 
      className={`bg-card-bg/40 backdrop-blur-xl border border-glass-border p-6 rounded-[32px] transition-all group flex flex-col gap-6 ${isOutOfStock ? 'opacity-50 grayscale' : 'hover:border-accent/30'}`}
    >
      <div className="flex justify-between items-start">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border ${isOutOfStock ? 'bg-glass text-text-muted border-glass-border' : 'bg-accent/10 text-accent border border-accent/20'}`}>
          {item.blood_group}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Units Left</p>
          <h4 className={`text-xl font-black ${isOutOfStock ? 'text-text-muted' : item.quantity > 5 ? 'text-text-primary' : 'text-accent animate-pulse'}`}>
            {item.quantity} Units
          </h4>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Unit Price</p>
        <p className={`text-2xl font-black tracking-tighter ${isOutOfStock ? 'text-text-muted' : 'text-emerald-500'}`}>₦{displayPrice.toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto">
        <div className={`flex items-center gap-3 bg-glass p-1.5 rounded-2xl border border-glass-border ${isOutOfStock ? 'pointer-events-none' : ''}`}>
          <button 
            disabled={isOutOfStock}
            onClick={() => setCardQty(Math.max(1, cardQty - 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-glass text-text-muted hover:text-accent transition-all disabled:opacity-30"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-black text-text-primary w-6 text-center">{cardQty}</span>
          <button 
            disabled={isOutOfStock}
            onClick={() => setCardQty(Math.min(item.quantity, cardQty + 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-glass text-text-muted hover:text-accent transition-all disabled:opacity-30"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button 
          disabled={isOutOfStock}
          onClick={() => {
            const existing = cart.find(c => c.id === item.id);
            if (existing) {
              setCart(cart.map(c => c.id === item.id ? { ...c, cartQuantity: Math.min(item.quantity, c.cartQuantity + cardQty) } : c));
            } else {
              setCart([...cart, { ...item, cartQuantity: cardQty }]);
            }
            setCardQty(1);
            toast.success(`${item.blood_group} added to sale`);
          }}
          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${isOutOfStock ? 'bg-glass text-text-muted cursor-not-allowed shadow-none' : 'bg-accent text-white hover:bg-accent-hover active:scale-95 shadow-accent/10'}`}
        >
          {isOutOfStock ? 'Depleted' : 'Add To Sale'}
        </button>
      </div>
    </div>
  );
};

const BloodBankPOS = () => {
  const [inventory, setInventory] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await usersApi.getMe();
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  };

  const fetchData = async () => {
    try {
      const [invRes, typesRes] = await Promise.all([
        inventoryApi.listInventory(),
        adminApi.listBloodTypes()
      ]);
      setInventory(invRes.data.results || invRes.data);
      setBloodTypes(typesRes.data.results || typesRes.data);
    } catch (err) {
      toast.error('Failed to sync terminal inventory');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.cartQuantity < product.quantity) {
        setCart(cart.map(item => 
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        ));
      }
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    const existing = cart.find(item => item.id === id);
    if (existing.cartQuantity > 1) {
      setCart(cart.map(item => 
        item.id === id ? { ...item, cartQuantity: item.cartQuantity - 1 } : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== id));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.cartQuantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const sales = [];
      for (const item of cart) {
        const itemPrice = parseFloat(item.price);
        const res = await transactionApi.directPosSale({
          product: item.product,
          blood_type: item.blood_type,
          quantity: item.cartQuantity,
          blood_price: itemPrice,
          total_amount: itemPrice * item.cartQuantity
        });
        sales.push(res.data);
      }

      const totalAmount = calculateTotal();
      const lastSale = sales[sales.length - 1];

      const paymentInit = await paymentApi.initialize({
        blood_request_id: lastSale.id,
        amount: totalAmount,
        callback_url: `${window.location.origin}/bloodbank/inventory` // Redirect back to inventory or POS
      });

      if (paymentInit.data?.authorization_url) {
        toast.loading('Redirecting to secure gateway...');
        window.location.href = paymentInit.data.authorization_url;
      } else {
        throw new Error('No authorization URL received');
      }

    } catch (err) {
      toast.error('Terminal Protocol Failure: Checkout Aborted');
      setIsProcessing(false);
    }
  };

  const displayInventory = bloodTypes.map(type => {
    const invItem = inventory.find(inv => inv.blood_type === type.id || inv.blood_group === type.group);
    return invItem ? invItem : {
      id: `virtual-${type.id}`,
      blood_type: type.id,
      blood_group: type.group,
      price: type.base_price,
      quantity: 0,
      product: null
    };
  });

  const filteredInventory = displayInventory.filter(item => 
    item.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 h-[calc(100vh-80px)] flex flex-col gap-8 animate-fade-in relative z-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase">Swift<span className="text-gradient">POS</span></h1>
          <p className="text-text-secondary mt-1 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Zap className="w-3 h-3 text-amber-500" />
            Active Checkout Terminal
          </p>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-6 py-3 rounded-2xl"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Transaction Successful</span>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Inventory Selection */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search blood group..."
              className="w-full bg-glass border border-glass-border rounded-3xl py-5 pl-16 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all text-lg font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-20 flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-accent animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Syncing Local Nodes...</p>
                </div>
              ) : filteredInventory.map(item => (
                <InventoryCard 
                  key={item.id} 
                  item={item} 
                  cart={cart} 
                  setCart={setCart} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cart / Checkout */}
        <div className="w-[450px] bg-card-bg/60 backdrop-blur-3xl border border-glass-border rounded-[48px] flex flex-col overflow-hidden shadow-2xl relative">
           <div className="p-8 border-b border-glass-border flex justify-between items-center bg-glass/20">
             <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Sale Summary</h2>
             </div>
             <span className="px-3 py-1 bg-accent rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
               {cart.length} Types
             </span>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
             {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                 <Receipt className="w-16 h-16 mb-4" />
                 <p className="font-bold uppercase tracking-widest text-xs">Terminal Standby</p>
                 <p className="text-[10px] mt-2">Add blood units to initiate sale</p>
               </div>
             ) : cart.map(item => {
               const itemPrice = parseFloat(item.price);
               
               return (
                 <div key={item.id} className="flex items-center gap-6 group animate-slide-in">
                   <div className="w-12 h-12 rounded-xl bg-glass border border-glass-border flex items-center justify-center font-black text-accent">
                     {item.blood_group}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-black text-text-primary truncate uppercase tracking-tighter">Blood Unit</p>
                     <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">₦{itemPrice.toLocaleString()} / Unit</p>
                   </div>
                   <div className="flex items-center gap-3 bg-glass p-1 rounded-xl border border-glass-border">
                      <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-accent transition-colors"><Minus className="w-4 h-4" /></button>
                      <span className="font-black text-sm w-4 text-center">{item.cartQuantity}</span>
                      <button onClick={() => addToCart(item)} className="p-1 hover:text-accent transition-colors"><Plus className="w-4 h-4" /></button>
                   </div>
                   <button 
                    onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                    className="p-2 opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent transition-all"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               );
             })}
           </div>

           <div className="p-8 bg-glass/30 border-t border-glass-border space-y-6">
             <div className="space-y-3">
                  <div className="flex justify-between text-text-secondary uppercase tracking-widest text-[10px] font-black">
                    <span>Subtotal</span>
                    <span>₦{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-glass-border/30 flex justify-between items-center">
                    <span className="text-text-primary font-black uppercase tracking-widest text-xs">Total Revenue</span>
                    <span className="text-3xl font-black text-text-primary tracking-tighter">₦{calculateTotal().toLocaleString()}</span>
                  </div>
               </div>

               <button 
                 disabled={cart.length === 0 || isProcessing}
                 onClick={handleCheckout}
                 className="w-full btn btn-primary py-6 rounded-3xl shadow-2xl shadow-accent/20 flex items-center justify-center gap-4 group relative overflow-hidden disabled:opacity-50"
               >
                 {isProcessing ? (
                   <Loader2 className="w-6 h-6 animate-spin text-white" />
                 ) : (
                   <>
                    <CreditCard className="w-6 h-6" />
                    <span className="text-lg font-black uppercase tracking-[0.2em]">Pay</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                   </>
                 )}
               </button>
            </div>
         </div>
       </div>
    </div>
  );
};

export default BloodBankPOS;
