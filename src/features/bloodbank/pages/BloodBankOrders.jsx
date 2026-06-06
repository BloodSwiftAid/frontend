import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ChevronRight,
  Droplet,
  Hospital as HospitalIcon,
  User,
  AlertCircle,
  Package
} from 'lucide-react';
import { transactionApi } from '../../../services/api';
import { useIsVerified } from '../../../shared/hooks/useIsVerified';
import { toast } from 'react-hot-toast';

const BloodBankOrders = () => {
  const isVerified = useIsVerified();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING, APPROVED, DISPATCHED, etc.
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await transactionApi.listRequests();
      const results = data ? (Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []) : [];
      setOrders(results);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    if (!isVerified) {
      toast.error('Facility verification required for fulfillment actions');
      return;
    }
    try {
      if (action === 'approve') await transactionApi.approveRequest(id);
      else if (action === 'reject') await transactionApi.rejectRequest(id);
      fetchOrders();
    } catch (err) {
      console.error(`Failed to ${action} order:`, err);
      toast.error(err.response?.data?.message || `Failed to ${action} order`);
    }
  };

  const tabs = [
    { id: 'PENDING', label: 'Incoming', icon: Clock },
    { id: 'APPROVED', label: 'Processing', icon: Package },
    { id: 'DISPATCHED', label: 'In Transit', icon: Truck },
    { id: 'DELIVERED', label: 'Fulfilled', icon: CheckCircle2 },
  ];

  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase">Order <span className="text-gradient">Management</span></h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <ArrowLeftRight className="w-3 h-3 text-accent" />
            Track incoming and outgoing blood requests
          </p>
        </div>
      </header>

      {/* Pipeline Tabs */}
      <div className="flex gap-4 p-2 bg-glass border border-glass-border rounded-[24px] w-full max-w-4xl">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all duration-500 ${activeTab === tab.id ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'text-text-secondary hover:text-white hover:bg-glass'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-glass text-text-muted'}`}>
              {orders.filter(o => o.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
            <Package className="w-20 h-20 mb-6 text-text-primary" />
            <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">No Orders</h3>
            <p className="text-sm font-bold uppercase tracking-widest mt-2">No {activeTab.toLowerCase()} orders at this time</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-glass/50 border-b border-glass-border">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Blood Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Patient / Hospital</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Quantity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/5 transition-all">
                  <td className="px-8 py-6 font-black text-text-primary text-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Droplet className="w-5 h-5 text-accent" />
                      </div>
                      {order.blood_group}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-glass flex items-center justify-center font-black text-xs text-text-primary">
                        {order.patient_name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-black text-text-primary uppercase tracking-tighter">{order.patient_name || 'Emergency Patient'}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">{order.hospital_location || 'Not Specified'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-text-primary">{order.quantity} Units</p>
                    <p className="text-[10px] text-emerald-500 font-black">₦{order.total_amount?.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                        className="p-3 hover:bg-glass rounded-xl text-text-muted hover:text-accent transition-all"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                      {order.status === 'PENDING' && (
                        <>
                          <button 
                            disabled={!isVerified}
                            onClick={() => handleAction(order.id, 'approve')}
                            className={`p-3 bg-emerald-500/10 text-emerald-500 transition-all rounded-xl shadow-lg ${!isVerified ? 'opacity-20 cursor-not-allowed' : 'hover:bg-emerald-500 hover:text-white shadow-emerald-500/10'}`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            disabled={!isVerified}
                            onClick={() => handleAction(order.id, 'reject')}
                            className={`p-3 bg-accent/10 text-accent transition-all rounded-xl shadow-lg ${!isVerified ? 'opacity-20 cursor-not-allowed' : 'hover:bg-accent hover:text-white shadow-accent/10'}`}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-darker/90 backdrop-blur-2xl animate-fade-in" onClick={() => setShowDetailModal(false)} />
          <div className="bg-card-bg border border-glass-border rounded-[56px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-16">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-black text-text-primary uppercase tracking-tighter mb-2">Request <span className="text-gradient">Detail</span></h2>
                  <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.3em]">Order ID: #{selectedOrder.id ? String(selectedOrder.id).slice(0, 8) : ''}</p>
                </div>
                <div className="w-20 h-20 bg-accent rounded-3xl flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-black">{selectedOrder.blood_group}</span>
                  <span className="text-[8px] font-bold uppercase">Blood Unit</span>
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Patient Name</p>
                    <p className="text-xl font-black text-text-primary">{selectedOrder.patient_name || 'Emergency Patient'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Delivery Location</p>
                    <p className="text-xl font-black text-text-primary">{selectedOrder.hospital_location || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Order Notes</p>
                  <div className="p-6 bg-glass border border-glass-border rounded-3xl min-h-[120px]">
                    <p className="text-text-secondary font-medium leading-relaxed">
                      "{selectedOrder.patient_details || 'No clinical justification provided.'}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-8 bg-accent/5 border border-accent/10 rounded-[32px]">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-2xl">
                         <Clock className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Received At</p>
                         <p className="font-black text-text-primary">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Units</p>
                      <p className="text-2xl font-black text-accent">{selectedOrder.quantity} Units</p>
                   </div>
                </div>
              </div>

              <div className="mt-12">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="w-full py-5 border border-glass-border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-white hover:bg-glass transition-all"
                >
                  Close Order Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankOrders;
