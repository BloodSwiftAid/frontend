import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { adminApi } from '../../api';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  MapPin, 
  Mail, 
  Phone,
  ShieldCheck,
  Building2,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  FileText,
  Weight,
  ArrowRight,
  ArrowLeft,
  Filter,
  Loader2,
  ChevronRight,
  User,
  Lock,
  Globe
} from 'lucide-react';

const BloodBankManagement = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [stats, setStats] = useState({
    blood_banks: 0,
    hospitals: 0,
    total_users: 0,
    pending_verifications: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingOrg, setEditingOrg] = useState(null);
  
  // User Modification State
  const [modifyingUser, setModifyingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [banksRes, statsRes] = await Promise.all([
        adminApi.listBloodBanks(),
        adminApi.getSystemStats()
      ]);
      const data = banksRes.data.results || banksRes.data;
      setBloodBanks(Array.isArray(data) ? data : []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching blood bank data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [newOrg, setNewOrg] = useState({
    name: '',
    address: '',
    state: '',
    lga: '',
    contact_email: '',
    contact_phone: '',
    license_number: '',
    storage_capacity_liters: 0
  });
  
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'BLOODBANK_ADMIN'
  });

  useEffect(() => {
    if (isModalOpen || selectedBank) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, selectedBank]);

  const handleUpdateUser = async (userId) => {
    try {
      const updateData = {};
      if (newPassword) updateData.password = newPassword;
      updateData.must_change_password = forcePasswordChange;
      
      await adminApi.updateUser(userId, updateData);
      alert('User credentials updated successfully.');
      setModifyingUser(null);
      setNewPassword('');
      setForcePasswordChange(false);
      fetchData(); // Refresh to get updated user list in selected bank
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user security protocol.');
    }
  };

  const handleToggleVerification = async (bank) => {
    try {
      const newStatus = !bank.is_verified;
      await adminApi.updateBloodBank(bank.id, { is_verified: newStatus });
      alert(`Facility ${newStatus ? 'Verified' : 'Unverified'} successfully.`);
      fetchData();
      // Update selectedBank state if it's open
      if (selectedBank?.id === bank.id) {
        setSelectedBank({ ...selectedBank, is_verified: newStatus });
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      alert('Action failed. Please check network logs.');
    }
  };

  const handleOnboard = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      if (editingOrg) {
        await adminApi.updateBloodBank(editingOrg.id, newOrg);
      } else {
        const orgRes = await adminApi.createBloodBank(newOrg);
        const orgId = orgRes.data.id;

        const userRes = await adminApi.createUser({
          ...newAdmin,
          username: newAdmin.email,
          email: newAdmin.email || newOrg.contact_email
        });
        const userId = userRes.data.id;

        await adminApi.createProfile({
          user_id: userId,
          blood_bank_id: orgId
        });
      }

      setIsModalOpen(false);
      setEditingOrg(null);
      setCurrentStep(1);
      fetchData();
      resetForms();
    } catch (error) {
      console.error('Error in onboarding/update:', error);
      alert('Operation failed. Please check the details.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (bank) => {
    setEditingOrg(bank);
    setNewOrg({
      name: bank.name,
      address: bank.address,
      state: bank.state,
      lga: bank.lga,
      contact_email: bank.contact_email,
      contact_phone: bank.contact_phone,
      license_number: bank.license_number || '',
      storage_capacity_liters: bank.storage_capacity_liters || 0
    });
    setCurrentStep(1);
    setIsModalOpen(true);
    setSelectedBank(null); // Close detail panel if open
  };

  const resetForms = () => {
    setNewOrg({ name: '', address: '', state: '', lga: '', contact_email: '', contact_phone: '', license_number: '', storage_capacity_liters: 0 });
    setNewAdmin({ email: '', password: '', first_name: '', last_name: '', role: 'BLOODBANK_ADMIN' });
    setEditingOrg(null);
    setCurrentStep(1);
  };

  const filteredBanks = Array.isArray(bloodBanks) ? bloodBanks.filter(bank => 
    bank?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank?.state?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const nextStep = () => {
    if (currentStep < (editingOrg ? 1 : 2)) setCurrentStep(currentStep + 1);
    else handleOnboard();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="p-8 space-y-10 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Blood Bank <span className="text-gradient">Registry</span></h1>
          <p className="text-text-secondary mt-2">Oversee and expand the life-saving infrastructure.</p>
        </div>
        <button 
          onClick={() => { resetForms(); setIsModalOpen(true); }}
          className="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 gap-3 group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span className="font-bold tracking-tight">Onboard New Facility</span>
        </button>
      </header>
      
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-700">
        <div className="bg-glass border border-glass-border p-6 rounded-[32px] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Total Banks</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-black text-white">{stats.blood_banks || 0}</h4>
            <span className="text-[10px] font-bold text-emerald-500 mb-2">+2 New</span>
          </div>
        </div>
        <div className="bg-glass border border-glass-border p-6 rounded-[32px] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Network Capacity</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-black text-white">{bloodBanks.reduce((acc, b) => acc + (parseFloat(b.storage_capacity_liters) || 0), 0)}L</h4>
            <span className="text-[10px] font-bold text-blue-400 mb-2">Total Liters</span>
          </div>
        </div>
        <div className="bg-glass border border-glass-border p-6 rounded-[32px] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Personnel Strength</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-black text-white">{stats.total_users || 0}</h4>
            <span className="text-[10px] font-bold text-accent mb-2">Active Users</span>
          </div>
        </div>
        <div className="bg-glass border border-glass-border p-6 rounded-[32px] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Pending Compliance</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-black text-white">{stats.pending_verifications || 0}</h4>
            <span className="text-[10px] font-bold text-amber-500 mb-2">Verify Now</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-card-bg/40 backdrop-blur-xl border border-glass-border p-4 rounded-2xl focus-within:border-accent/50 transition-all">
          <Search className="w-5 h-5 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by name, state, or location..." 
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline bg-glass border-glass-border px-6 rounded-2xl gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {loading && bloodBanks.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredBanks.map((bank) => (
            <div 
              key={bank.id} 
              onClick={() => setSelectedBank(bank)}
              className="group relative bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[32px] p-8 hover:border-accent/50 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-500">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${bank.is_verified ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                      {bank.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-accent transition-colors">{bank.name}</h3>
                
                <div className="space-y-4 my-6">
                  <div className="flex items-start gap-3 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 mt-0.5 text-accent/60" />
                    <span className="leading-relaxed">{bank.address}, {bank.lga}, {bank.state}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Mail className="w-4 h-4 text-accent/60" />
                    <span>{bank.contact_email}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-glass-border flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest">
                    <Weight className="w-4 h-4 text-emerald-500" />
                    <span>{bank.storage_capacity_liters}L Cap.</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(bank); }}
                      className="p-3 bg-glass hover:bg-accent/10 rounded-xl transition-all text-blue-400 border border-glass-border"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(bank.id); }}
                      className="p-3 bg-glass hover:bg-accent/10 rounded-xl transition-all text-accent border border-glass-border"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-Step Wizard Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] bg-bg-darker animate-in fade-in duration-500 overflow-hidden flex">
          {/* Immersive Sidebar Info */}
          <div className="w-full md:w-80 lg:w-96 bg-glass border-r border-glass-border p-12 flex flex-col justify-between h-screen hidden md:flex shrink-0">
            <div className="space-y-10">
              <div className="w-16 h-16 bg-accent rounded-[24px] flex items-center justify-center shadow-2xl shadow-accent/40">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Onboarding<br/><span className="text-accent">Protocol</span></h2>
                <div className="w-12 h-1 bg-accent mt-4 rounded-full" />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                You are registering a new critical node in the SwiftAid blood logistics network. Please ensure all data points are verified.
              </p>
              
              <div className="space-y-6">
                <div className={`flex items-center gap-4 transition-all ${currentStep === 1 ? 'text-accent' : 'text-text-muted'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${currentStep === 1 ? 'border-accent' : 'border-glass-border'}`}>1</div>
                  <span className="text-xs uppercase tracking-[0.2em] font-black">Infrastructure</span>
                </div>
                <div className={`flex items-center gap-4 transition-all ${currentStep === 2 ? 'text-accent' : 'text-text-muted'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${currentStep === 2 ? 'border-accent' : 'border-glass-border'}`}>2</div>
                  <span className="text-xs uppercase tracking-[0.2em] font-black">Security Control</span>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 p-6 rounded-3xl border border-accent/10">
              <p className="text-[10px] font-black uppercase text-accent tracking-widest mb-2">Help Desk</p>
              <p className="text-xs text-text-secondary">Need assistance? <span className="text-white underline cursor-pointer">View documentation</span></p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-bg-darker flex flex-col h-screen overflow-hidden">
            <div className="p-10 border-b border-glass-border flex justify-between items-center bg-card-bg/50 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => { setIsModalOpen(false); setEditingOrg(null); }} className="p-2 hover:bg-glass rounded-xl transition-colors text-text-secondary">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                  {editingOrg ? `Editing: ${newOrg.name}` : 'Blood Bank Onboard'}
                </h3>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingOrg(null); }} className="p-3 bg-glass hover:bg-accent/10 rounded-xl transition-colors group">
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-5xl mx-auto w-full">
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                      <Globe className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Facility Logistics</h2>
                      <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest opacity-60">Phase I: Global Infrastructure</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-accent ml-1">Official Facility Name</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all shadow-inner"
                        placeholder="Lagos Central Blood Logistics"
                        value={newOrg.name}
                        onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Regulatory License</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        placeholder="LIC-XXXXX"
                        value={newOrg.license_number}
                        onChange={(e) => setNewOrg({...newOrg, license_number: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Storage Capacity (L)</label>
                      <input 
                        type="number"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newOrg.storage_capacity_liters}
                        onChange={(e) => setNewOrg({...newOrg, storage_capacity_liters: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Operational Address</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        placeholder="Enter full street address"
                        value={newOrg.address}
                        onChange={(e) => setNewOrg({...newOrg, address: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Official Facility Email</label>
                      <input 
                        type="email"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        placeholder="logistics@bloodbank.ng"
                        value={newOrg.email}
                        onChange={(e) => setNewOrg({...newOrg, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Logistics Contact Phone</label>
                      <input 
                        type="tel"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        placeholder="+234 ..."
                        value={newOrg.phone}
                        onChange={(e) => setNewOrg({...newOrg, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">State Jurisdiction</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newOrg.state}
                        onChange={(e) => setNewOrg({...newOrg, state: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">LGA Region</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newOrg.lga}
                        onChange={(e) => setNewOrg({...newOrg, lga: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Lock className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Identity Access</h2>
                      <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest opacity-60">Phase II: Security Control</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">First Name</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newAdmin.first_name}
                        onChange={(e) => setNewAdmin({...newAdmin, first_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Last Name</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newAdmin.last_name}
                        onChange={(e) => setNewAdmin({...newAdmin, last_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Auth Email</label>
                      <input 
                        type="email"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Security Password</label>
                      <input 
                        type="password"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        placeholder="••••••••"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16 pt-10 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <button 
                      onClick={prevStep}
                      className="btn btn-outline py-5 px-8 rounded-2xl text-white border-glass-border bg-glass gap-3"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="font-bold">Previous Phase</span>
                    </button>
                  )}
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => { setIsModalOpen(false); setEditingOrg(null); }}
                    className="flex-1 md:flex-none btn btn-outline py-5 px-10 rounded-2xl text-white border-glass-border bg-glass"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={loading}
                    className="flex-1 md:flex-none btn btn-primary py-5 px-14 rounded-2xl shadow-2xl shadow-accent/30 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <>
                        <span className="font-black uppercase tracking-widest text-sm">
                          {editingOrg ? 'Commit Update' : (currentStep === 2 ? 'Setup Protocol' : 'Proceed to Phase II')}
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            {!editingOrg && (
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-glass/20">
                <div 
                  className="h-full bg-accent shadow-[0_0_15px_rgba(255,51,102,0.5)] transition-all duration-700" 
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                />
              </div>
            )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Detail Modal / Panel */}
      {selectedBank && createPortal(
        <div className="fixed inset-0 z-[2500] flex items-center justify-end animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-bg-darker/60 backdrop-blur-sm" onClick={() => setSelectedBank(null)} />
          
          <div className="relative w-full max-w-4xl h-full bg-bg-darker border-l border-glass-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-700">
            {/* Detail Header */}
            <div className="p-8 border-b border-glass-border flex justify-between items-center bg-card-bg/30 backdrop-blur-2xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Building2 className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedBank.name}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">{selectedBank.license_number}</span>
                    <span className="w-1 h-1 rounded-full bg-glass-border" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{selectedBank.storage_capacity_liters}L Total Storage</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => openEditModal(selectedBank)}
                  className="p-4 bg-glass hover:bg-blue-500/10 rounded-2xl transition-all group"
                >
                  <Edit2 className="w-6 h-6 text-blue-400" />
                </button>
                <button 
                  onClick={() => setSelectedBank(null)}
                  className="p-4 bg-glass hover:bg-accent/10 rounded-2xl transition-all group"
                >
                  <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary opacity-40">Operational Details</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 rounded-xl bg-glass flex items-center justify-center"><MapPin className="w-5 h-5 text-accent" /></div>
                      <span className="text-sm font-bold">{selectedBank.address}, {selectedBank.lga}, {selectedBank.state}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 rounded-xl bg-glass flex items-center justify-center"><Mail className="w-5 h-5 text-accent" /></div>
                      <span className="text-sm font-bold">{selectedBank.contact_email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 rounded-xl bg-glass flex items-center justify-center"><Phone className="w-5 h-5 text-accent" /></div>
                      <span className="text-sm font-bold">{selectedBank.contact_phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-glass p-8 rounded-3xl border border-glass-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Globe className="w-20 h-20" /></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Facility Status</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Verification</span>
                      <button 
                        onClick={() => handleToggleVerification(selectedBank)}
                        className={`group/verify flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${selectedBank.is_verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-accent/10 hover:border-accent hover:text-accent' : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-500'}`}
                      >
                        {selectedBank.is_verified ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Authorized</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verify Facility</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Clinical Rating</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-accent' : 'bg-glass'}`} />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personnel Registry */}
              <div className="space-y-8 pt-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary opacity-40 mb-2">Personnel Registry</h4>
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Authorized Staff</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {selectedBank.staff?.length > 0 ? (
                    selectedBank.staff.map(user => (
                      <div key={user.id} className="bg-glass/30 border border-glass-border rounded-2xl p-6 flex items-center justify-between group hover:bg-glass/50 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/20 uppercase">
                            {user.first_name?.[0] || user.email[0]}
                          </div>
                          <div>
                            <p className="text-white font-black uppercase tracking-tight">{user.first_name} {user.last_name}</p>
                            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-0.5">{user.role.replace('_', ' ')} • {user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          {user.must_change_password && (
                            <span className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                              <Lock className="w-3 h-3" />
                              Setup Required
                            </span>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setModifyingUser(user); }}
                            className="p-3 bg-glass hover:bg-accent text-white rounded-xl transition-all border border-glass-border"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-glass/10 border border-glass-border border-dashed rounded-3xl p-12 text-center">
                      <p className="text-text-secondary text-sm">No authorized personnel found for this facility.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Modification Modal */}
          {modifyingUser && (
            <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
              <div className="absolute inset-0 bg-bg-darker/80 backdrop-blur-md" onClick={() => setModifyingUser(null)} />
              <div className="relative w-full max-w-md bg-card-bg border border-glass-border rounded-[40px] p-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />
                
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Modify Security</h3>
                <p className="text-text-secondary text-sm mb-8">Updating access for <span className="text-white font-bold">{modifyingUser.email}</span></p>
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Force Security Reset</label>
                    <button 
                      onClick={() => setForcePasswordChange(!forcePasswordChange)}
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${forcePasswordChange ? 'bg-accent/10 border-accent text-accent' : 'bg-glass border-glass-border text-text-secondary'}`}
                    >
                      <span className="font-bold text-xs">Require Setup on Next Login</span>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${forcePasswordChange ? 'bg-accent' : 'bg-glass-border'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${forcePasswordChange ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Emergency Password Reset</label>
                    <input 
                      type="password"
                      placeholder="Enter new security password"
                      className="w-full bg-glass border border-glass-border rounded-2xl px-5 py-4 text-white outline-none focus:border-accent/50 transition-all"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setModifyingUser(null)}
                      className="flex-1 py-4 px-6 rounded-2xl border border-glass-border text-white font-bold hover:bg-glass transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleUpdateUser(modifyingUser.id)}
                      className="flex-1 py-4 px-6 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Commit Security
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default BloodBankManagement;
