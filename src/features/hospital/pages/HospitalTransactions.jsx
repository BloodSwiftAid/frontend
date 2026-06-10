import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck,
  Box,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar,
  ShieldCheck,
  Zap,
  ChevronRight,
  Droplet,
  Info
} from 'lucide-react';
import { transactionApi } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionRow = ({ tx }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'DISPATCHED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'REJECTED': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-glass-border/30 text-text-muted border-glass-border/50';
    }
  };

  return (
    <>
      <tr className="hover:bg-accent/5 transition-all group/row cursor-pointer border-b border-glass-border/30" onClick={() => setIsExpanded(!isExpanded)}>
        <td className="px-8 py-6">
          <span className="font-mono font-black text-text-muted text-[10px] uppercase tracking-widest">#{tx.id.toString().slice(-8)}</span>
        </td>
        <td className="px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/10 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="text-lg font-black text-text-primary tracking-tighter uppercase">{tx.blood_group || 'N/A'}</span>
              <div className="flex items-center gap-2">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-60">{tx.source || 'POS'}</p>
                {tx.batch_id && (
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-500/5 text-blue-500/40 text-[7px] font-mono font-bold border border-blue-500/10">
                    BATCH: {tx.batch_id.slice(0, 8)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>
        <td className="px-8 py-6">
          <span className="font-black text-text-primary uppercase tracking-widest text-[11px]">{tx.quantity} Units</span>
        </td>
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="font-black text-text-primary">₦{tx.total_amount?.toLocaleString()}</span>
            {tx.payment?.status === 'SUCCESS' && (
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-2 h-2" /> Verified
              </span>
            )}
          </div>
        </td>
        <td className="px-8 py-6">
          <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(tx.status)}`}>
             {tx.status}
          </div>
        </td>
        <td className="px-8 py-6 text-right">
          <button className="p-3 bg-glass border border-glass-border rounded-xl text-text-muted group-hover/row:text-accent transition-all">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
      </tr>
      
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan="6" className="p-0 border-b border-glass-border/30 bg-glass/5">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Order Summary</p>
                      <div className="bg-glass p-6 rounded-3xl border border-glass-border">
                         <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-text-secondary">Total Amount Paid</span>
                            <span className="text-xl font-black text-text-primary tracking-tighter">₦{tx.total_amount?.toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Payment Meta</p>
                      <div className="bg-glass p-6 rounded-3xl border border-glass-border space-y-4">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Transaction Reference</span>
                            <span className="text-[10px] font-mono font-black text-text-primary break-all">{tx.payment?.transaction_reference || 'N/A'}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Authorization Status</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              tx.payment?.status === 'SUCCESS' ? 'text-emerald-500' : 
                              tx.payment?.status === 'FAILED' ? 'text-accent' : 'text-amber-500'
                            }`}>
                              {tx.payment?.status || 'NO PAYMENT'}
                            </span>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

const HospitalTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionApi.getRequests();
      const txData = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setTransactions(txData);
    } catch (error) {
      toast.error('Failed to load transaction logs');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.id.toString().includes(searchTerm) ||
    t.blood_group?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">Updating Audit Logs...</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-glass-border pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Financial Ledger</span>
             </div>
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Verified Audits</span>
             </div>
          </div>
          <h1 className="text-6xl font-black tracking-tight text-text-primary uppercase leading-none">
            Procurement <span className="text-gradient">Logs</span>
          </h1>
          <p className="text-text-secondary max-w-xl font-bold uppercase tracking-widest text-[10px] leading-relaxed opacity-60">
            Historical archive of all blood supply orders. Every transaction is indexed with full pricing model transparency.
          </p>
        </div>

        <div className="flex-1 lg:max-w-md w-full relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            className="w-full bg-card-bg/30 backdrop-blur-xl border border-glass-border rounded-2xl py-5 pl-16 pr-8 text-text-primary font-bold uppercase tracking-widest text-xs outline-none focus:border-accent/50 transition-all shadow-sm" 
            placeholder="Search Order ID or Group..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-glass/50 border-b border-glass-border">
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Order ID</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Blood Details</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Quantity</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Revenue</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Status</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {filteredTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 && (
            <div className="py-40 flex flex-col items-center justify-center opacity-30">
               <Box className="w-16 h-16 mb-6" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">Zero Transaction Records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalTransactions;
