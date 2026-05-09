import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Activity,
  Droplet
} from 'lucide-react';
import { inventoryApi } from '../../api';

const PricingMatrix = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editPrices, setEditPrices] = useState({});

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const { data } = await inventoryApi.listInventory();
      const items = data.results || data;
      setInventory(items);
      
      // Initialize edit prices
      const prices = {};
      items.forEach(item => {
        prices[item.id] = item.price;
      });
      setEditPrices(prices);
    } catch (err) {
      console.error('Failed to fetch pricing matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, value) => {
    setEditPrices(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSavePrices = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(editPrices).map(([id, price]) => 
          inventoryApi.updateStock(id, { price: parseFloat(price) })
        )
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchPricing();
    } catch (err) {
      console.error('Failed to update price matrix:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase">Revenue <span className="text-gradient">Matrix</span></h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            Biological Asset Valuation & Unit Pricing
          </p>
        </div>
        <button 
          onClick={handleSavePrices}
          disabled={saving}
          className="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 gap-3 group disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-bold tracking-tight">Deploy Pricing</span>
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-glass-border bg-glass/20 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Price Configuration</h3>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Set unit base rates for biological fulfillment</p>
              </div>
              {success && (
                <div className="flex items-center gap-2 text-emerald-500 animate-bounce">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Registry Updated</span>
                </div>
              )}
            </div>

            <div className="p-0">
              {loading ? (
                <div className="p-20 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-glass/30 border-b border-glass-border">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Type</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Unit Price (₦)</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Live Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border/30">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-accent/5 transition-all">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center font-black text-accent text-2xl">
                              {item.blood_group}
                            </div>
                            <div>
                              <p className="font-black text-text-primary text-lg leading-none">{item.blood_group} Asset</p>
                              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1.5">Whole Biological Unit</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="inline-flex items-center bg-glass border border-glass-border rounded-xl px-4 py-2 focus-within:border-accent/50 transition-all">
                            <span className="text-emerald-500 font-black mr-2">₦</span>
                            <input 
                              type="number"
                              className="bg-transparent border-none outline-none text-text-primary font-black w-24 text-right"
                              value={editPrices[item.id] || 0}
                              onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <span className="font-black text-text-secondary">{item.quantity} Units</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-accent/10 border border-accent/20 rounded-[40px] p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-20">
               <Activity className="w-20 h-20 text-accent" />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-4">Pricing Strategy</h3>
               <p className="text-sm text-text-secondary leading-relaxed mb-6">
                 Set competitive but sustainable pricing for your biological assets. These rates will be visible to clinical facilities in the marketplace.
               </p>
               <div className="space-y-4">
                 <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <TrendingUp className="w-5 h-5 text-emerald-500" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-text-primary">Market Driven Valuation</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[40px] p-8">
            <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-accent" />
              Guidelines
            </h3>
            <ul className="space-y-4">
              {[
                'Prices are per single biological unit (approx 450ml).',
                'Updates reflect instantly on the marketplace portal.',
                'Ensure pricing covers facility overhead and logistics.',
                'Promotional rates can be adjusted manually here.'
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingMatrix;
