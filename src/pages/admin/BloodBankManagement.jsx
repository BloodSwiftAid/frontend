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
  Globe,
  Award,
  Activity
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
  const [error, setError] = useState('');


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
      const msg = error.response?.data?.message || 'Error fetching blood bank data.';
      setError(msg);
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
    storage_capacity_liters: 0,
    commission_percentage: 10.0
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
      alert('User updated successfully.');
      setModifyingUser(null);
      setNewPassword('');
      setForcePasswordChange(false);
      fetchData(); // Refresh to get updated user list in selected bank
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update user.';
      setError(msg);
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
      const msg = error.response?.data?.message || 'Action failed. Please check network logs.';
      setError(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to decommission this facility? All linked assets will be archived.')) return;
    try {
      await adminApi.deleteBloodBank(id);
      alert('Facility decommissioned successfully.');
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Decommissioning failed.';
      setError(msg);
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
      const msg = error.response?.data?.message || 'Operation failed. Please check the details.';
      setError(msg);
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
      storage_capacity_liters: bank.storage_capacity_liters || 0,
      commission_percentage: bank.commission_percentage || 10.0
    });
    setCurrentStep(1);
    setIsModalOpen(true);
    setSelectedBank(null); // Close detail panel if open
  };

  const resetForms = () => {
    setNewOrg({ name: '', address: '', state: '', lga: '', contact_email: '', contact_phone: '', license_number: '', storage_capacity_liters: 0, commission_percentage: 10.0 });
    setNewAdmin({ email: '', password: '', first_name: '', last_name: '', role: 'BLOODBANK_ADMIN' });
    setEditingOrg(null);
    setCurrentStep(1);
  };

  const filteredBanks = Array.isArray(bloodBanks) ? bloodBanks.filter(bank => 
    bank?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank?.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank?.license_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const nextStep = () => {
    if (currentStep < (editingOrg ? 1 : 2)) setCurrentStep(currentStep + 1);
    else handleOnboard();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Blood <span className="text-gradient">Banks</span>
          </h1>
          <p className="text-text-secondary flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
            <Globe className="w-3.5 h-3.5 text-accent" />
            Blood Bank Registry
          </p>
        </div>
        <button 
          onClick={() => { setError(''); resetForms(); setIsModalOpen(true); }}
          className="btn btn-primary px-10 py-5 rounded-[28px] gap-4 shadow-2xl shadow-accent/20 group"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-500">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Add Blood Bank</span>
        </button>
      </header>

      {error && (
        <div className="bg-accent/5 border border-accent/20 text-accent p-6 rounded-3xl flex items-center justify-between gap-4 animate-shake">
          <div className="flex items-center gap-4">
            <div className="bg-accent/10 p-2 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-sm font-black uppercase tracking-tight">{error}</p>
          </div>
          <button onClick={() => setError('')} className="p-2 hover:bg-accent/10 rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Executive Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Banks', value: stats.blood_banks, icon: Building2, color: 'text-primary' },
          { label: 'Total Capacity', value: `${bloodBanks.reduce((acc, b) => acc + (parseFloat(b.storage_capacity_liters) || 0), 0)}L`, icon: Weight, color: 'text-emerald-500' },
          { label: 'Total Staff', value: stats.total_users, icon: Award, color: 'text-accent' },
          { label: 'Pending Review', value: stats.pending_verifications, icon: Activity, color: 'text-amber-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-8 rounded-[40px] hover:border-accent/30 transition-all group shadow-sm">
            <div className={`w-14 h-14 rounded-2xl bg-glass border border-glass-border flex items-center justify-center ${stat.color} mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">{stat.label}</p>
            <h4 className="text-4xl font-black text-text-primary tracking-tighter">{stat.value || 0}</h4>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex items-center gap-5 bg-card-bg/40 backdrop-blur-2xl border border-glass-border px-10 py-6 rounded-3xl focus-within:border-accent/50 transition-all shadow-inner">
          <Search className="w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by facility name, license, or administrative zone..." 
            className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-muted/50 font-black text-sm uppercase tracking-wider"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline bg-glass border-glass-border px-10 rounded-3xl gap-4 font-black uppercase tracking-widest text-[10px] group">
          <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform" />
          Refine Protocol
        </button>
      </div>

      {loading && bloodBanks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8">
          <div className="relative w-20 h-20">
             <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
             <Activity className="absolute inset-0 m-auto w-8 h-8 text-accent animate-pulse" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Synchronizing Facility Registry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredBanks.map((bank) => (
            <div 
              key={bank.id} 
              onClick={() => setSelectedBank(bank)}
              className="group relative bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[56px] p-12 hover:border-accent/40 transition-all duration-700 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-accent/5 overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none group-hover:scale-125">
                <Building2 className="w-64 h-64" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="p-5 rounded-[28px] bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 border border-accent/20 shadow-xl shadow-accent/5">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${bank.is_verified ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                    {bank.is_verified ? 'Authorized Node' : 'Audit Pending'}
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-text-primary mb-5 leading-[1.1] tracking-tighter uppercase group-hover:text-accent transition-colors">{bank.name}</h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4 text-sm text-text-secondary">
                    <MapPin className="w-5 h-5 mt-0.5 text-accent/60 flex-shrink-0" />
                    <span className="leading-relaxed font-black uppercase tracking-tight text-[11px]">{bank.address}, {bank.lga}, {bank.state}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <Mail className="w-5 h-5 text-accent/60 flex-shrink-0" />
                    <span className="font-black uppercase tracking-tight text-[11px] truncate opacity-70">{bank.contact_email}</span>
                  </div>
                </div>

                <div className="pt-10 border-t border-glass-border flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] block">Payload Cap.</span>
                    <span className="text-2xl font-black text-text-primary tracking-tighter">{bank.storage_capacity_liters}L</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(bank); }}
                      className="p-5 bg-glass border border-glass-border hover:bg-primary/10 rounded-2xl transition-all text-primary hover:text-primary shadow-xl hover:shadow-primary/20"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(bank.id); }}
                      className="p-5 bg-glass border border-glass-border hover:bg-accent/10 rounded-2xl transition-all text-accent shadow-xl hover:shadow-accent/20"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Immersive Onboarding/Edit Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] bg-bg-darker/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent blur-[250px] rounded-full animate-pulse" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary blur-[250px] rounded-full animate-pulse" />
          </div>

          <div className="relative w-full max-w-6xl max-h-[90vh] bg-card-bg border border-glass-border rounded-[64px] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-10 md:p-16 flex flex-col md:flex-row h-full overflow-hidden">
              {/* Context Sidebar */}
              <div className="w-full md:w-80 space-y-12 shrink-0 md:border-r border-glass-border md:pr-16 mb-12 md:mb-0">
                <div className="w-24 h-24 bg-accent rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-accent/40 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 group-hover:rotate-180 transition-transform duration-1000" />
                  {editingOrg ? <Edit2 className="w-10 h-10 relative z-10" /> : <Plus className="w-10 h-10 relative z-10" />}
                </div>
                <div>
                  <h2 className="text-5xl font-black text-text-primary tracking-tighter uppercase leading-[0.9]">
                    {editingOrg ? 'Update' : 'Provision'}<br/>
                    <span className="text-accent">Protocol</span>
                  </h2>
                  <div className="w-20 h-2 bg-accent mt-8 rounded-full" />
                </div>

                <div className="space-y-10">
                  <div className={`flex items-center gap-8 transition-all duration-500 ${currentStep === 1 ? 'opacity-100 scale-105 translate-x-2' : 'opacity-30'}`}>
                    <div className={`w-12 h-12 rounded-[20px] border-4 flex items-center justify-center text-sm font-black ${currentStep === 1 ? 'border-accent bg-accent/10 text-accent' : 'border-glass-border text-text-secondary'}`}>01</div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Phase Alpha</p>
                      <p className="text-xs font-black text-text-primary uppercase tracking-widest">Asset Metrics</p>
                    </div>
                  </div>
                  {!editingOrg && (
                    <div className={`flex items-center gap-8 transition-all duration-500 ${currentStep === 2 ? 'opacity-100 scale-105 translate-x-2' : 'opacity-30'}`}>
                      <div className={`w-12 h-12 rounded-[20px] border-4 flex items-center justify-center text-sm font-black ${currentStep === 2 ? 'border-accent bg-accent/10 text-accent' : 'border-glass-border text-text-secondary'}`}>02</div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Phase Beta</p>
                        <p className="text-xs font-black text-text-primary uppercase tracking-widest">Identity Control</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-16">
                   <div className="p-8 bg-glass border border-glass-border rounded-[32px] space-y-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                         <ShieldCheck className="w-12 h-12 text-emerald-500" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Security Directive</h4>
                      <p className="text-[11px] text-text-secondary font-black uppercase leading-relaxed tracking-tight opacity-80 relative z-10">
                        Facility provisioning requires rigorous biological license verification for compliance.
                      </p>
                   </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 md:pl-16 overflow-y-auto custom-scrollbar">
                {currentStep === 1 && (
                  <div className="space-y-16 animate-in slide-in-from-right-16 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Facility Designation (Full Name)</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[24px] px-8 py-6 text-text-primary outline-none focus:border-accent transition-all font-black text-xl placeholder:text-text-muted/20"
                          placeholder="e.g. METRO LOGISTICS CENTER"
                          value={newOrg.name}
                          onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Regulatory License Protocol</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black uppercase tracking-widest placeholder:text-text-muted/20"
                          placeholder="LIC-XXXX-XXXX"
                          value={newOrg.license_number}
                          onChange={(e) => setNewOrg({...newOrg, license_number: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Volumetric Capacity</label>
                        <div className="relative">
                          <input 
                            type="number"
                            className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black text-xl"
                            value={newOrg.storage_capacity_liters}
                            onChange={(e) => setNewOrg({...newOrg, storage_capacity_liters: e.target.value})}
                          />
                          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-accent font-black text-sm tracking-widest">LTRS</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-accent ml-2">Operational Commission Protocol</label>
                        <div className="relative">
                          <input 
                            type="number"
                            className="w-full bg-accent/5 border border-accent/20 rounded-[20px] px-8 py-5 text-accent outline-none focus:border-accent transition-all font-black text-2xl"
                            value={newOrg.commission_percentage}
                            onChange={(e) => setNewOrg({...newOrg, commission_percentage: e.target.value})}
                          />
                          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-accent font-black text-xl">%</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Secure Link (Phone)</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black tracking-widest"
                          placeholder="+234 ..."
                          value={newOrg.contact_phone}
                          onChange={(e) => setNewOrg({...newOrg, contact_phone: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Physical Coordination Point (Address)</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black opacity-80"
                          placeholder="COMPLETE PHYSICAL GEOLOCATION DATA"
                          value={newOrg.address}
                          onChange={(e) => setNewOrg({...newOrg, address: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Administrative Zone (State)</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black uppercase"
                          value={newOrg.state}
                          onChange={(e) => setNewOrg({...newOrg, state: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">LGA Sector</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black uppercase"
                          value={newOrg.lga}
                          onChange={(e) => setNewOrg({...newOrg, lga: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-16 animate-in slide-in-from-right-16 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                       <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Administrative Identity (Secure Email)</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black"
                          type="email"
                          placeholder="admin@facility.cluster"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">First Identity Name</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black uppercase"
                          value={newAdmin.first_name}
                          onChange={(e) => setNewAdmin({...newAdmin, first_name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Last Identity Name</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black uppercase"
                          value={newAdmin.last_name}
                          onChange={(e) => setNewAdmin({...newAdmin, last_name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Security Override Credential</label>
                        <div className="relative">
                          <input 
                            type="password"
                            className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black tracking-[0.5em]"
                            placeholder="••••••••"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                          />
                          <Lock className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-20 pt-12 border-t border-glass-border flex justify-between items-center gap-8">
                  <div className="flex gap-4">
                    {currentStep > 1 && (
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="btn btn-outline py-5 px-10 rounded-[20px] border-glass-border bg-glass gap-4 group"
                      >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">Back</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-outline py-5 px-10 rounded-[20px] text-text-muted border-glass-border bg-glass font-black uppercase tracking-[0.2em] text-[10px] hover:text-accent"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={editingOrg ? handleOnboard : (currentStep === 1 ? () => setCurrentStep(2) : handleOnboard)}
                      disabled={loading}
                      className="btn btn-primary py-5 px-16 rounded-[24px] shadow-2xl shadow-accent/40 flex items-center justify-center gap-6"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-6 h-6" />
                      ) : (
                        <>
                          <span className="font-black uppercase tracking-[0.3em] text-[10px]">
                            {editingOrg ? 'Save Changes' : (currentStep === 2 ? 'Register Blood Bank' : 'Next Step')}
                          </span>
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Detail Modal / Panel */}
      {selectedBank && createPortal(
        <div className="fixed inset-0 z-[2500] flex items-center justify-end animate-in fade-in duration-700 overflow-hidden">
          <div className="absolute inset-0 bg-bg-darker/80 backdrop-blur-xl" onClick={() => setSelectedBank(null)} />
          
          <div className="relative w-full max-w-4xl h-full bg-bg-darker border-l border-glass-border shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-1000 overflow-hidden">
            <div className="p-12 border-b border-glass-border flex justify-between items-center bg-card-bg/50 backdrop-blur-3xl shrink-0">
               <div className="flex items-center gap-10">
                  <div className="w-24 h-24 rounded-[32px] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-2xl shadow-accent/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 group-hover:rotate-180 transition-transform duration-1000" />
                    <Building2 className="w-12 h-12 relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-none">{selectedBank.name}</h2>
                    <div className="flex items-center gap-6 mt-4">
                       <div className="flex items-center gap-3 text-[10px] font-black uppercase text-accent tracking-[0.3em] bg-accent/5 px-4 py-2 rounded-xl border border-accent/10 shadow-sm">
                          <Globe className="w-4 h-4" />
                          {selectedBank.license_number}
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10 shadow-sm">
                          <Activity className="w-4 h-4 animate-pulse" />
                          {selectedBank.storage_capacity_liters}L Payload Cap.
                       </div>
                    </div>
                  </div>
               </div>
               <div className="flex gap-5">
                  <button onClick={() => openEditModal(selectedBank)} className="p-6 bg-glass border border-glass-border hover:bg-primary/10 rounded-[24px] transition-all text-primary shadow-xl hover:shadow-primary/20">
                    <Edit2 className="w-6 h-6" />
                  </button>
                  <button onClick={() => setSelectedBank(null)} className="p-6 bg-glass border border-glass-border hover:bg-accent/10 rounded-[24px] transition-all text-text-primary group shadow-xl">
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-16 custom-scrollbar space-y-20">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-10">
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted mb-8">Node Coordinates</h4>
                        <div className="space-y-8">
                           {[
                             { icon: MapPin, label: 'Physical Location', value: `${selectedBank.address}, ${selectedBank.lga}, ${selectedBank.state}` },
                             { icon: Mail, label: 'Digital Terminal', value: selectedBank.contact_email },
                             { icon: Phone, label: 'Secure Link', value: selectedBank.contact_phone }
                           ].map((item, i) => (
                             <div key={i} className="flex items-center gap-8 p-8 bg-glass border border-glass-border rounded-[32px] hover:border-accent/40 transition-all group relative overflow-hidden shadow-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-16 h-16 rounded-[24px] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 relative z-10 shadow-lg shadow-accent/5">
                                   <item.icon className="w-6 h-6" />
                                </div>
                                <div className="relative z-10 space-y-1">
                                   <p className="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent/60 transition-colors">{item.label}</p>
                                   <span className="text-sm font-black text-text-primary uppercase tracking-tight leading-relaxed">{item.value}</span>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-10">
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted mb-8">System Authority</h4>
                        <div className="p-10 bg-glass border border-glass-border rounded-[48px] space-y-12 shadow-inner relative overflow-hidden group">
                           <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                              <ShieldCheck className="w-48 h-48" />
                           </div>
                           
                           <div className="flex justify-between items-center relative z-10">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Authorization Status</span>
                              <button 
                                onClick={() => handleToggleVerification(selectedBank)}
                                className={`px-8 py-3 rounded-[20px] border-2 transition-all flex items-center gap-4 group/btn ${selectedBank.is_verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}
                              >
                                 {selectedBank.is_verified ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 animate-pulse" />}
                                 <span className="text-[11px] font-black uppercase tracking-[0.2em]">{selectedBank.is_verified ? 'Authorized' : 'Review Required'}</span>
                              </button>
                           </div>

                           <div className="flex justify-between items-center relative z-10">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Revenue Yield Config</span>
                              <div className="flex items-center gap-5">
                                 <div className="px-6 py-3 bg-accent/10 border-2 border-accent/20 rounded-2xl font-black text-accent text-2xl shadow-lg shadow-accent/5">
                                    {selectedBank.commission_percentage}%
                                 </div>
                              </div>
                           </div>

                           <div className="pt-10 border-t border-glass-border flex justify-between items-center relative z-10">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Network Integrity</span>
                              <div className="flex gap-2">
                                 {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-3 h-3 rounded-full ${i <= 4 ? 'bg-accent shadow-[0_0_12px_rgba(225,29,72,0.6)] animate-pulse' : 'bg-glass-border opacity-30'}`} />)}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-10">
                  <div className="flex justify-between items-end">
                     <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">Control Layer</h4>
                        <h3 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-none">Personnel <span className="text-gradient">Registry</span></h3>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                     {selectedBank.staff?.length > 0 ? selectedBank.staff.map(user => (
                       <div key={user.id} className="p-10 bg-glass border border-glass-border rounded-[40px] flex items-center justify-between hover:bg-glass-border/40 transition-all group relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 w-1.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex items-center gap-10">
                             <div className="w-20 h-20 rounded-[28px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-3xl uppercase shadow-lg shadow-primary/5 group-hover:scale-105 transition-transform">
                                {user.first_name?.[0] || user.email[0]}
                             </div>
                             <div>
                                <p className="text-2xl font-black text-text-primary tracking-tighter uppercase">{user.first_name} {user.last_name}</p>
                                <p className="text-[10px] text-text-muted uppercase font-black tracking-[0.3em] mt-2 opacity-60">{user.role.replace('_', ' ')} • {user.email}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-8">
                             {user.must_change_password && (
                               <div className="flex items-center gap-4 px-5 py-2.5 bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 rounded-2xl animate-pulse">
                                  <Lock className="w-4 h-4" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Setup Required</span>
                               </div>
                             )}
                             <button onClick={() => setModifyingUser(user)} className="p-5 bg-glass border border-glass-border hover:bg-accent rounded-2xl text-text-primary hover:text-white transition-all shadow-xl hover:shadow-accent/40 group/lock">
                                <Lock className="w-6 h-6 group-hover/lock:rotate-12 transition-transform" />
                             </button>
                          </div>
                       </div>
                     )) : (
                       <div className="p-32 bg-glass border-2 border-glass-border border-dashed rounded-[56px] text-center space-y-6">
                          <div className="w-20 h-20 bg-glass-border/30 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                             <User className="w-10 h-10 text-text-muted" />
                          </div>
                          <p className="text-text-muted font-black uppercase tracking-[0.4em] text-[10px]">No active personnel assigned to this facility coordinate.</p>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Security Modals */}
      {modifyingUser && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
          <div className="absolute inset-0 bg-bg-darker/90 backdrop-blur-2xl" onClick={() => setModifyingUser(null)} />
          <div className="relative w-full max-w-lg bg-card-bg border border-glass-border rounded-[48px] p-12 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary" />
            
            <div className="space-y-4 mb-12">
               <div className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Security Override</span>
               </div>
               <h3 className="text-4xl font-black text-text-primary uppercase tracking-tighter leading-none">Access <span className="text-gradient">Control</span></h3>
               <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Identity: <span className="text-text-primary">{modifyingUser.email}</span></p>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Hard Reset Protocol</label>
                <button 
                  onClick={() => setForcePasswordChange(!forcePasswordChange)}
                  className={`w-full p-6 rounded-[24px] border-2 transition-all flex items-center justify-between group/switch ${forcePasswordChange ? 'bg-accent/10 border-accent/50 text-accent' : 'bg-glass border-glass-border text-text-muted'}`}
                >
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Require change on next login</span>
                  <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${forcePasswordChange ? 'bg-accent' : 'bg-glass-border'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${forcePasswordChange ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Administrative Credential Override</label>
                <div className="relative group">
                  <input 
                    type="text"
                    className="w-full bg-glass border border-glass-border rounded-[24px] px-8 py-6 text-text-primary outline-none focus:border-accent transition-all font-black text-sm tracking-[0.4em] placeholder:text-text-muted/10 placeholder:tracking-normal"
                    placeholder="ENTER OVERRIDE SECRET"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    onClick={() => setNewPassword(Math.random().toString(36).slice(-8).toUpperCase())}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-accent uppercase tracking-[0.3em] hover:text-accent-hover transition-colors bg-accent/5 px-4 py-2 rounded-xl border border-accent/10"
                  >
                    Auto-Gen
                  </button>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                 <button 
                   onClick={() => handleUpdateUser(modifyingUser.id)}
                   className="w-full btn btn-primary py-6 rounded-3xl shadow-2xl shadow-accent/40 font-black uppercase tracking-[0.4em] text-xs group"
                 >
                   Save Changes Update
                   <ShieldCheck className="w-5 h-5 ml-4 group-hover:scale-110 transition-transform inline-block" />
                 </button>
                 <button 
                   onClick={() => setModifyingUser(null)}
                   className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-colors"
                 >
                   Cancel Override
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankManagement;

