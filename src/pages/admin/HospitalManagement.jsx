import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { adminApi } from '../../api';
import { 
  Plus, 
  Search, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Filter,
  Loader2,
  Hospital as HospitalIcon,
  Activity,
  User,
  Lock,
  Stethoscope,
  Globe,
  Phone,
  ChevronRight,
  ExternalLink,
  Zap
} from 'lucide-react';

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [stats, setStats] = useState({
    blood_banks: 0,
    hospitals: 0,
    total_users: 0,
    pending_verifications: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
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
      const [hospRes, statsRes] = await Promise.all([
        adminApi.listHospitals(),
        adminApi.getSystemStats()
      ]);
      const data = hospRes.data.results || hospRes.data;
      setHospitals(Array.isArray(data) ? data : []);
      setStats(statsRes.data);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error fetching hospital data.';
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
    hospital_type: 'General',
    has_emergency_unit: false
  });

  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'HOSPITAL_ADMIN'
  });

  useEffect(() => {
    if (isModalOpen || selectedHospital) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, selectedHospital]);

  const handleUpdateUser = async (userId) => {
    try {
      const updateData = {};
      if (newPassword) updateData.password = newPassword;
      updateData.must_change_password = forcePasswordChange;
      
      await adminApi.updateUser(userId, updateData);
      alert('Personnel credentials updated successfully.');
      setModifyingUser(null);
      setNewPassword('');
      setForcePasswordChange(false);
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update credentials.';
      setError(msg);
    }
  };

  const handleToggleVerification = async (hosp) => {
    try {
      const newStatus = !hosp.is_verified;
      await adminApi.updateHospital(hosp.id, { is_verified: newStatus });
      alert(`Facility ${newStatus ? 'Authorized' : 'Deauthorized'} successfully.`);
      fetchData();
      if (selectedHospital?.id === hosp.id) {
        setSelectedHospital({ ...selectedHospital, is_verified: newStatus });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Authorization failed.';
      setError(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to decommission this clinical node? All linked asset history will be archived.')) return;
    try {
      await adminApi.deleteHospital(id);
      alert('Clinical node decommissioned successfully.');
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
        await adminApi.updateHospital(editingOrg.id, newOrg);
      } else {
        const orgRes = await adminApi.createHospital(newOrg);
        const orgId = orgRes.data.id;

        const userRes = await adminApi.createUser({
          ...newAdmin,
          username: newAdmin.email,
          email: newAdmin.email || 'contact@hospital.com'
        });
        const userId = userRes.data.id;

        await adminApi.createProfile({
          user_id: userId,
          hospital_id: orgId
        });
      }

      setIsModalOpen(false);
      setEditingOrg(null);
      setCurrentStep(1);
      fetchData();
      resetForms();
    } catch (error) {
      const msg = error.response?.data?.message || 'Onboarding failed. Please check the integrity of your input.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (hosp) => {
    setEditingOrg(hosp);
    setNewOrg({
      name: hosp.name,
      address: hosp.address,
      state: hosp.state,
      lga: hosp.lga,
      hospital_type: hosp.hospital_type || 'General',
      has_emergency_unit: hosp.has_emergency_unit || false
    });
    setCurrentStep(1);
    setIsModalOpen(true);
    setSelectedHospital(null); // Close detail panel if open
  };

  const resetForms = () => {
    setNewOrg({ name: '', address: '', state: '', lga: '', hospital_type: 'General', has_emergency_unit: false });
    setNewAdmin({ email: '', password: '', first_name: '', last_name: '', role: 'HOSPITAL_ADMIN' });
    setEditingOrg(null);
    setCurrentStep(1);
  };

  const filteredHospitals = Array.isArray(hospitals) ? hospitals.filter(h => 
    h?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h?.state?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Hospitals
          </h1>
          <p className="text-text-secondary flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
            <Globe className="w-3.5 h-3.5 text-accent" />
            Hospital Network
          </p>
        </div>
        <button 
          onClick={() => { setError(''); resetForms(); setIsModalOpen(true); }}
          className="btn btn-primary px-10 py-5 rounded-[28px] gap-4 shadow-2xl shadow-accent/20 group"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-500">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Add Hospital</span>
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

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Hospitals', value: stats.hospitals, icon: HospitalIcon, color: 'text-primary' },
          { label: 'Total Staff', value: stats.total_users, icon: User, color: 'text-emerald-500' },
          { label: 'Emergency Units', value: hospitals.filter(h => h.has_emergency_unit).length, icon: Activity, color: 'text-accent' },
          { label: 'Pending Review', value: stats.pending_verifications, icon: ShieldCheck, color: 'text-amber-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-8 rounded-[40px] hover:border-accent/30 transition-all group shadow-sm">
            <div className={`w-14 h-14 rounded-2xl bg-glass border border-glass-border flex items-center justify-center ${stat.color} mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-black/5`}>
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
            placeholder="Search by hospital name, regional LGA, or administrative zone..." 
            className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-muted/50 font-black text-sm uppercase tracking-wider"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline bg-glass border-glass-border px-10 rounded-3xl gap-4 font-black uppercase tracking-widest text-[10px] group">
          <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform" />
          Filter
        </button>
      </div>

      {loading && hospitals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8">
          <div className="relative w-20 h-20">
             <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
             <Activity className="absolute inset-0 m-auto w-8 h-8 text-accent animate-pulse" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Loading Hospitals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredHospitals.map((hosp) => (
            <div 
              key={hosp.id} 
              onClick={() => setSelectedHospital(hosp)}
              className="group relative bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[56px] p-12 hover:border-primary/40 transition-all duration-700 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none group-hover:scale-125">
                <HospitalIcon className="w-64 h-64" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="p-5 rounded-[28px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-primary/20 shadow-xl shadow-primary/5">
                    <HospitalIcon className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${hosp.is_verified ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                      {hosp.is_verified ? 'Authorized Node' : 'Audit Pending'}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-text-primary mb-5 leading-[1.1] tracking-tighter uppercase group-hover:text-primary transition-colors">{hosp.name}</h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4 text-sm text-text-secondary">
                    <MapPin className="w-5 h-5 mt-0.5 text-primary/60 flex-shrink-0" />
                    <span className="leading-relaxed font-black uppercase tracking-tight text-[11px]">{hosp.address}, {hosp.lga}, {hosp.state}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 ${hosp.has_emergency_unit ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-glass-border/30 border-glass-border/50 text-text-muted'}`}>
                       <Activity className="w-3.5 h-3.5" />
                       <span className="font-black uppercase tracking-widest text-[9px]">{hosp.has_emergency_unit ? 'ER EQUIPPED' : 'STANDARD CARE'}</span>
                    </div>
                    <div className="px-4 py-1.5 rounded-xl border border-glass-border/50 bg-glass-border/30 text-text-muted">
                       <span className="font-black uppercase tracking-widest text-[9px]">{hosp.hospital_type}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-glass-border flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-glass border border-glass-border flex items-center justify-center">
                       <Stethoscope className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Node</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(hosp); }}
                      className="p-5 bg-glass border border-glass-border hover:bg-primary/10 rounded-2xl transition-all text-primary shadow-xl hover:shadow-primary/20"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(hosp.id); }}
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

      {/* Multi-Step Wizard Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] bg-bg-darker/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary blur-[250px] rounded-full animate-pulse" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent blur-[250px] rounded-full animate-pulse" />
          </div>

          <div className="relative w-full max-w-6xl max-h-[90vh] bg-card-bg border border-glass-border rounded-[64px] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-10 md:p-16 flex flex-col md:flex-row h-full overflow-hidden">
              {/* Clinical Sidebar Info */}
              <div className="w-full md:w-80 space-y-12 shrink-0 md:border-r border-glass-border md:pr-16 mb-12 md:mb-0">
                <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-primary/40 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 group-hover:rotate-180 transition-transform duration-1000" />
                  {editingOrg ? <Edit2 className="w-10 h-10 relative z-10" /> : <Plus className="w-10 h-10 relative z-10" />}
                </div>
                <div>
                  <h2 className="text-5xl font-black text-text-primary tracking-tighter uppercase leading-[0.9]">
                    {editingOrg ? 'Update' : 'Hospital'}<br/>
                    <span className="text-primary">Facility</span>
                  </h2>
                  <div className="w-20 h-2 bg-primary mt-8 rounded-full" />
                </div>
                
                <div className="space-y-10">
                  <div className={`flex items-center gap-8 transition-all duration-500 ${currentStep === 1 ? 'opacity-100 scale-105 translate-x-2' : 'opacity-30'}`}>
                    <div className={`w-12 h-12 rounded-[20px] border-4 flex items-center justify-center text-sm font-black ${currentStep === 1 ? 'border-primary bg-primary/10 text-primary' : 'border-glass-border text-text-secondary'}`}>01</div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Phase Alpha</p>
                      <p className="text-xs font-black text-text-primary uppercase tracking-widest">Clinical Metrics</p>
                    </div>
                  </div>
                  {!editingOrg && (
                    <div className={`flex items-center gap-8 transition-all duration-500 ${currentStep === 2 ? 'opacity-100 scale-105 translate-x-2' : 'opacity-30'}`}>
                      <div className={`w-12 h-12 rounded-[20px] border-4 flex items-center justify-center text-sm font-black ${currentStep === 2 ? 'border-primary bg-primary/10 text-primary' : 'border-glass-border text-text-secondary'}`}>02</div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Phase Beta</p>
                        <p className="text-xs font-black text-text-primary uppercase tracking-widest">Identity Control</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-16">
                   <div className="p-8 bg-glass border border-glass-border rounded-[32px] space-y-6 relative overflow-hidden group shadow-sm">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                         <ShieldCheck className="w-12 h-12 text-emerald-500" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Security Directive</h4>
                      <p className="text-[11px] text-text-secondary font-black uppercase leading-relaxed tracking-tight opacity-80 relative z-10">
                        Hospital registration requires rigorous clinical licensing verification for compliance.
                      </p>
                   </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 md:pl-16 overflow-y-auto custom-scrollbar">
                {currentStep === 1 && (
                  <div className="space-y-16 animate-in slide-in-from-right-16 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Hospital Name</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[24px] px-8 py-6 text-text-primary outline-none focus:border-primary transition-all font-black text-xl placeholder:text-text-muted/20"
                          placeholder="e.g. SAINT JUDE MEDICAL CENTER"
                          value={newOrg.name}
                          onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Hospital Type</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black uppercase tracking-widest appearance-none"
                            value={newOrg.hospital_type}
                            onChange={(e) => setNewOrg({...newOrg, hospital_type: e.target.value})}
                          >
                            <option value="General">General Hospital</option>
                            <option value="Private">Private Clinic</option>
                            <option value="Teaching">Teaching / Research</option>
                            <option value="Specialist">Specialist Center</option>
                          </select>
                          <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/40 rotate-90" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Emergency Services</label>
                        <button 
                          onClick={() => setNewOrg({...newOrg, has_emergency_unit: !newOrg.has_emergency_unit})}
                          className={`w-full p-5 rounded-[20px] border-2 transition-all flex items-center justify-between group/switch ${newOrg.has_emergency_unit ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 font-black' : 'bg-glass border-glass-border text-text-muted font-bold'}`}
                        >
                          <span className="uppercase tracking-[0.2em] text-[10px]">Emergency Unit Available</span>
                          <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${newOrg.has_emergency_unit ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-glass-border'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${newOrg.has_emergency_unit ? 'right-1' : 'left-1'}`} />
                          </div>
                        </button>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Hospital Address</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black opacity-80"
                          placeholder="COMPLETE PHYSICAL GEOLOCATION DATA"
                          value={newOrg.address}
                          onChange={(e) => setNewOrg({...newOrg, address: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Phone Number</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black tracking-widest"
                          placeholder="+234 ..."
                          value={newOrg.phone}
                          onChange={(e) => setNewOrg({...newOrg, phone: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Email Address</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black"
                          placeholder="contact@hospital.cluster"
                          value={newOrg.email}
                          onChange={(e) => setNewOrg({...newOrg, email: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">State</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black uppercase"
                          value={newOrg.state}
                          onChange={(e) => setNewOrg({...newOrg, state: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">LGA</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black uppercase"
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
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black"
                          type="email"
                          placeholder="admin@hospital.cluster"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">First Identity Name</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black uppercase"
                          value={newAdmin.first_name}
                          onChange={(e) => setNewAdmin({...newAdmin, first_name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Last Identity Name</label>
                        <input 
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black uppercase"
                          value={newAdmin.last_name}
                          onChange={(e) => setNewAdmin({...newAdmin, last_name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Security Override Credential</label>
                        <div className="relative">
                          <input 
                            type="password"
                            className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black tracking-[0.5em]"
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
                        onClick={prevStep}
                        className="btn btn-outline py-5 px-10 rounded-[20px] border-glass-border bg-glass gap-4 group"
                      >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">Back</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setIsModalOpen(false); setEditingOrg(null); }}
                      className="btn btn-outline py-5 px-10 rounded-[20px] text-text-muted border-glass-border bg-glass font-black uppercase tracking-[0.2em] text-[10px] hover:text-accent"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={nextStep}
                      disabled={loading}
                      className="btn btn-primary py-5 px-16 rounded-[24px] shadow-2xl shadow-primary/40 flex items-center justify-center gap-6 bg-primary border-none"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-6 h-6" />
                      ) : (
                        <>
                          <span className="font-black uppercase tracking-[0.3em] text-[10px]">
                            {editingOrg ? 'Save Changes' : (currentStep === 2 ? 'Register Hospital' : 'Next Step')}
                          </span>
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Progress Bar */}
              {!editingOrg && (
                <div className="absolute bottom-0 left-0 w-full h-2 bg-glass/20">
                  <div 
                    className="h-full bg-primary shadow-[0_0_20px_rgba(13,148,136,0.5)] transition-all duration-1000 ease-out" 
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
      {selectedHospital && createPortal(
        <div className="fixed inset-0 z-[2500] flex items-center justify-end animate-in fade-in duration-700 overflow-hidden">
          <div className="absolute inset-0 bg-bg-darker/80 backdrop-blur-xl" onClick={() => setSelectedHospital(null)} />
          
          <div className="relative w-full max-w-4xl h-full bg-bg-darker border-l border-glass-border shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-1000 overflow-hidden">
            {/* Detail Header */}
            <div className="p-12 border-b border-glass-border flex justify-between items-center bg-card-bg/50 backdrop-blur-3xl shrink-0">
               <div className="flex items-center gap-10">
                  <div className="w-24 h-24 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 group-hover:rotate-180 transition-transform duration-1000" />
                    <HospitalIcon className="w-12 h-12 relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-none">{selectedHospital.name}</h2>
                    <div className="flex items-center gap-6 mt-4">
                       <div className="flex items-center gap-3 text-[10px] font-black uppercase text-primary tracking-[0.3em] bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 shadow-sm">
                          <Globe className="w-4 h-4" />
                          {selectedHospital.hospital_type}
                       </div>
                       <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-xl border shadow-sm ${selectedHospital.has_emergency_unit ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-glass-border/30 text-text-muted border-glass-border/50'}`}>
                          <Activity className={`w-4 h-4 ${selectedHospital.has_emergency_unit ? 'animate-pulse' : ''}`} />
                          {selectedHospital.has_emergency_unit ? 'ER Equipped' : 'Standard Care'}
                       </div>
                    </div>
                  </div>
               </div>
               <div className="flex gap-5">
                  <button onClick={() => openEditModal(selectedHospital)} className="p-6 bg-glass border border-glass-border hover:bg-primary/10 rounded-[24px] transition-all text-primary shadow-xl hover:shadow-primary/20">
                    <Edit2 className="w-6 h-6" />
                  </button>
                  <button onClick={() => setSelectedHospital(null)} className="p-6 bg-glass border border-glass-border hover:bg-accent/10 rounded-[24px] transition-all text-text-primary group shadow-xl">
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-16 custom-scrollbar space-y-20">
               {/* Info Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-10">
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted mb-8">Node Coordinates</h4>
                        <div className="space-y-8">
                           {[
                             { icon: MapPin, label: 'Physical Location', value: `${selectedHospital.address}, ${selectedHospital.lga}, ${selectedHospital.state}` },
                             { icon: Mail, label: 'Digital Terminal', value: selectedHospital.email || 'N/A' },
                             { icon: Phone, label: 'Secure Link', value: selectedHospital.phone || 'N/A' }
                           ].map((item, i) => (
                             <div key={i} className="flex items-center gap-8 p-8 bg-glass border border-glass-border rounded-[32px] hover:border-primary/40 transition-all group relative overflow-hidden shadow-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-16 h-16 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 relative z-10 shadow-lg shadow-primary/5">
                                   <item.icon className="w-6 h-6" />
                                </div>
                                <div className="relative z-10 space-y-1">
                                   <p className="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary/60 transition-colors">{item.label}</p>
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
                        <div className="p-10 bg-glass border border-glass-border rounded-[48px] space-y-12 shadow-inner relative overflow-hidden group shadow-sm">
                           <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                              <ShieldCheck className="w-48 h-48" />
                           </div>
                           
                           <div className="flex justify-between items-center relative z-10">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Authorization Status</span>
                              <button 
                                onClick={() => handleToggleVerification(selectedHospital)}
                                className={`px-8 py-3 rounded-[20px] border-2 transition-all flex items-center gap-4 group/verify ${selectedHospital.is_verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}
                              >
                                 {selectedHospital.is_verified ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 animate-pulse" />}
                                 <span className="text-[11px] font-black uppercase tracking-[0.2em]">{selectedHospital.is_verified ? 'Authorized' : 'Review Required'}</span>
                              </button>
                           </div>

                           <div className="flex justify-between items-center relative z-10">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Network Performance</span>
                              <div className="flex items-center gap-5">
                                 <div className="px-6 py-3 bg-primary/10 border-2 border-primary/20 rounded-2xl font-black text-primary text-2xl shadow-lg shadow-primary/5">
                                    94%
                                 </div>
                              </div>
                           </div>

                           <div className="pt-10 border-t border-glass-border flex justify-between items-center relative z-10">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Clinical Integrity</span>
                              <div className="flex gap-2">
                                 {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-3 h-3 rounded-full ${i <= 4 ? 'bg-primary shadow-[0_0_12px_rgba(13,148,136,0.6)] animate-pulse' : 'bg-glass-border opacity-30'}`} />)}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Personnel Registry */}
               <div className="space-y-10">
                  <div className="flex justify-between items-end">
                     <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">Control Layer</h4>
                        <h3 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-none">Personnel <span className="text-gradient">Registry</span></h3>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {selectedHospital.staff?.length > 0 ? (
                      selectedHospital.staff.map(user => (
                        <div key={user.id} className="p-10 bg-glass border border-glass-border rounded-[40px] flex items-center justify-between hover:bg-glass-border/40 transition-all group relative overflow-hidden shadow-sm">
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
                               <div className="flex items-center gap-4 px-5 py-2.5 bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 rounded-2xl animate-pulse shadow-sm">
                                  <Lock className="w-4 h-4" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Setup Required</span>
                               </div>
                             )}
                             <button 
                               onClick={(e) => { e.stopPropagation(); setModifyingUser(user); }}
                               className="p-5 bg-glass border border-glass-border hover:bg-accent rounded-2xl text-text-primary hover:text-white transition-all shadow-xl hover:shadow-accent/40 group/lock"
                             >
                               <Lock className="w-6 h-6 group-hover/lock:rotate-12 transition-transform" />
                             </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-32 bg-glass border-2 border-glass-border border-dashed rounded-[56px] text-center space-y-6 opacity-40 shadow-inner">
                        <div className="w-20 h-20 bg-glass-border/30 rounded-full flex items-center justify-center mx-auto mb-4">
                           <User className="w-10 h-10 text-text-muted" />
                        </div>
                        <p className="text-text-muted font-black uppercase tracking-[0.4em] text-[10px]">No authorized clinical personnel detected for this node.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* User Modification Modal */}
      {modifyingUser && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-bg-darker/90 backdrop-blur-2xl" onClick={() => setModifyingUser(null)} />
          <div className="relative w-full max-w-lg bg-card-bg border border-glass-border rounded-[48px] p-12 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
            
            <div className="space-y-4 mb-12">
               <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Security Override</span>
               </div>
               <h3 className="text-4xl font-black text-text-primary uppercase tracking-tighter leading-none">Access <span className="text-gradient">Control</span></h3>
               <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Identity: <span className="text-text-primary">{modifyingUser.email}</span></p>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Hard Reset Protocol</label>
                <button 
                  onClick={() => setForcePasswordChange(!forcePasswordChange)}
                  className={`w-full p-6 rounded-[24px] border-2 transition-all flex items-center justify-between group/switch shadow-sm ${forcePasswordChange ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-glass border-glass-border text-text-muted'}`}
                >
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Require change on next login</span>
                  <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${forcePasswordChange ? 'bg-primary' : 'bg-glass-border'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${forcePasswordChange ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Administrative Credential Override</label>
                <div className="relative group">
                  <input 
                    type="password"
                    placeholder="ENTER OVERRIDE SECRET"
                    className="w-full bg-glass border border-glass-border rounded-[24px] px-8 py-6 text-text-primary outline-none focus:border-primary transition-all font-black text-sm tracking-[0.4em] placeholder:text-text-muted/10 placeholder:tracking-normal shadow-inner"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    onClick={() => setNewPassword(Math.random().toString(36).slice(-8).toUpperCase())}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:text-primary-hover transition-colors bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 shadow-sm"
                  >
                    Auto-Gen
                  </button>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                 <button 
                   onClick={() => handleUpdateUser(modifyingUser.id)}
                   className="w-full btn btn-primary py-6 rounded-3xl shadow-2xl shadow-primary/40 font-black uppercase tracking-[0.4em] text-xs group"
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default HospitalManagement;
