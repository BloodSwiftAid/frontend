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
  Stethoscope
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
      console.error('Error fetching hospital data:', error);
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
      alert('User credentials updated successfully.');
      setModifyingUser(null);
      setNewPassword('');
      setForcePasswordChange(false);
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user security protocol.');
    }
  };

  const handleToggleVerification = async (hosp) => {
    try {
      const newStatus = !hosp.is_verified;
      await adminApi.updateHospital(hosp.id, { is_verified: newStatus });
      alert(`Facility ${newStatus ? 'Verified' : 'Unverified'} successfully.`);
      fetchData();
      if (selectedHospital?.id === hosp.id) {
        setSelectedHospital({ ...selectedHospital, is_verified: newStatus });
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
      console.error('Error in onboarding/update:', error);
      alert('Operation failed. Please check the details.');
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
    <div className="p-8 space-y-10 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Clinical <span className="text-gradient">Network</span></h1>
          <p className="text-text-secondary mt-2">Manage healthcare facilities and strategic hospital nodes.</p>
        </div>
        <button 
          onClick={() => { resetForms(); setIsModalOpen(true); }}
          className="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 gap-3 group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span className="font-bold tracking-tight">Onboard New Hospital</span>
        </button>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-700">
        <div className="bg-glass border border-glass-border p-6 rounded-[32px] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Affiliated Hospitals</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-black text-white">{stats.hospitals || 0}</h4>
            <span className="text-[10px] font-bold text-blue-400 mb-2">Total Nodes</span>
          </div>
        </div>
        <div className="bg-glass border border-glass-border p-6 rounded-[32px] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Clinical Personnel</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-black text-white">{stats.total_users || 0}</h4>
            <span className="text-[10px] font-bold text-accent mb-2">Active Staff</span>
          </div>
        </div>
        <div className="bg-glass border border-glass-border p-6 rounded-[32px] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Emergency Capacity</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-black text-white">{hospitals.filter(h => h.has_emergency_unit).length}</h4>
            <span className="text-[10px] font-bold text-emerald-500 mb-2">ER Ready</span>
          </div>
        </div>
        <div className="bg-glass border border-glass-border p-6 rounded-[32px] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Compliance Alerts</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-black text-white">{stats.pending_verifications || 0}</h4>
            <span className="text-[10px] font-bold text-amber-500 mb-2">Needs Audit</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-card-bg/40 backdrop-blur-xl border border-glass-border p-4 rounded-2xl focus-within:border-accent/50 transition-all">
          <Search className="w-5 h-5 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by hospital name, state, or regional LGA..." 
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline bg-glass border-glass-border px-6 rounded-2xl gap-2">
          <Filter className="w-4 h-4" />
          Designation
        </button>
      </div>

      {loading && hospitals.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredHospitals.map((hosp) => (
            <div 
              key={hosp.id} 
              onClick={() => setSelectedHospital(hosp)}
              className="group relative bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[32px] p-8 hover:border-blue-500/50 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-500">
                    <HospitalIcon className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {hosp.hospital_type}
                    </span>
                    {hosp.has_emergency_unit && (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20" title="Emergency Unit Available">
                        <Activity className="w-4 h-4 text-emerald-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{hosp.name}</h3>
                
                <div className="space-y-4 my-6">
                  <div className="flex items-start gap-3 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 mt-0.5 text-blue-500/60" />
                    <span className="leading-relaxed">{hosp.address}, {hosp.lga}, {hosp.state}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-glass-border flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Operational node</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(hosp); }}
                      className="p-3 bg-glass hover:bg-blue-500/10 rounded-xl transition-all text-blue-400 border border-glass-border"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(hosp.id); }}
                      className="p-3 bg-glass hover:bg-blue-500/10 rounded-2xl transition-all text-accent border border-glass-border"
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
          {/* Clinical Sidebar Info */}
          <div className="w-full md:w-80 lg:w-96 bg-glass border-r border-glass-border p-12 flex flex-col justify-between h-screen hidden md:flex shrink-0">
            <div className="space-y-10">
              <div className="w-16 h-16 bg-blue-500 rounded-[24px] flex items-center justify-center shadow-2xl shadow-blue-500/40">
                <HospitalIcon className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Clinical<br/><span className="text-blue-500">Node</span></h2>
                <div className="w-12 h-1 bg-blue-500 mt-4 rounded-full" />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Registering a healthcare facility requires precise clinical data and administrative delegation.
              </p>
              
              <div className="space-y-6">
                <div className={`flex items-center gap-4 transition-all ${currentStep === 1 ? 'text-blue-400' : 'text-text-muted'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${currentStep === 1 ? 'border-blue-400' : 'border-glass-border'}`}>1</div>
                  <span className="text-xs uppercase tracking-[0.2em] font-black">Facility Profile</span>
                </div>
                <div className={`flex items-center gap-4 transition-all ${currentStep === 2 ? 'text-blue-400' : 'text-text-muted'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${currentStep === 2 ? 'border-blue-400' : 'border-glass-border'}`}>2</div>
                  <span className="text-xs uppercase tracking-[0.2em] font-black">Access Protocol</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2">Protocol Guide</p>
              <p className="text-xs text-text-secondary">Ensure the emergency unit status is accurately declared.</p>
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
                  {editingOrg ? `Editing: ${newOrg.name}` : 'Hospital Onboard'}
                </h3>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingOrg(null); }} className="p-3 bg-glass hover:bg-blue-500/10 rounded-xl transition-colors group">
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-5xl mx-auto w-full">
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Stethoscope className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Facility Definition</h2>
                      <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest opacity-60">Phase I: Clinical Profile</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 ml-1">Hospital Designation</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all shadow-inner"
                        placeholder="Saint Jude Medical Center"
                        value={newOrg.name}
                        onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Clinical Classification</label>
                      <select 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all appearance-none"
                        value={newOrg.hospital_type}
                        onChange={(e) => setNewOrg({...newOrg, hospital_type: e.target.value})}
                      >
                        <option value="General">General Hospital</option>
                        <option value="Private">Private Clinic</option>
                        <option value="Teaching">Teaching / Research</option>
                        <option value="Specialist">Specialist Center</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between bg-glass border border-glass-border rounded-xl px-5 py-3.5 h-[54px]">
                      <label className="text-[9px] font-black uppercase tracking-[0.1em] text-white">Emergency Unit</label>
                      <div 
                        className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${newOrg.has_emergency_unit ? 'bg-emerald-500' : 'bg-glass-border'}`}
                        onClick={() => setNewOrg({...newOrg, has_emergency_unit: !newOrg.has_emergency_unit})}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${newOrg.has_emergency_unit ? 'left-7' : 'left-1'}`} />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Operational Address</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        placeholder="Full physical address"
                        value={newOrg.address}
                        onChange={(e) => setNewOrg({...newOrg, address: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Official Facility Email</label>
                      <input 
                        type="email"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        placeholder="contact@hospital.ng"
                        value={newOrg.email}
                        onChange={(e) => setNewOrg({...newOrg, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Emergency Contact Phone</label>
                      <input 
                        type="tel"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        placeholder="+234 ..."
                        value={newOrg.phone}
                        onChange={(e) => setNewOrg({...newOrg, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">State</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        value={newOrg.state}
                        onChange={(e) => setNewOrg({...newOrg, state: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">LGA</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
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
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Administrative Access</h2>
                      <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest opacity-60">Phase II: Access Protocol</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">First Name</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        value={newAdmin.first_name}
                        onChange={(e) => setNewAdmin({...newAdmin, first_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Last Name</label>
                      <input 
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        value={newAdmin.last_name}
                        onChange={(e) => setNewAdmin({...newAdmin, last_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Corporate Email</label>
                      <input 
                        type="email"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Security Password</label>
                      <input 
                        type="password"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
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
                      <span className="font-bold">Back</span>
                    </button>
                  )}
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => { setIsModalOpen(false); setEditingOrg(null); }}
                    className="flex-1 md:flex-none btn btn-outline py-5 px-10 rounded-2xl text-white border-glass-border bg-glass"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={loading}
                    className="flex-1 md:flex-none btn btn-primary py-5 px-14 rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 bg-blue-600 border-none"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <>
                        <span className="font-black uppercase tracking-widest text-sm">
                          {editingOrg ? 'Commit Update' : (currentStep === 2 ? 'Setup Node' : 'Next Step')}
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
                  className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-700" 
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
        <div className="fixed inset-0 z-[2500] flex items-center justify-end animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-bg-darker/60 backdrop-blur-sm" onClick={() => setSelectedHospital(null)} />
          
          <div className="relative w-full max-w-4xl h-full bg-bg-darker border-l border-glass-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-700">
            {/* Detail Header */}
            <div className="p-8 border-b border-glass-border flex justify-between items-center bg-card-bg/30 backdrop-blur-2xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <HospitalIcon className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedHospital.name}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{selectedHospital.hospital_type}</span>
                    <span className="w-1 h-1 rounded-full bg-glass-border" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{selectedHospital.has_emergency_unit ? 'ER Equipped' : 'Standard Care'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => openEditModal(selectedHospital)}
                  className="p-4 bg-glass hover:bg-blue-500/10 rounded-2xl transition-all group"
                >
                  <Edit2 className="w-6 h-6 text-blue-400" />
                </button>
                <button 
                  onClick={() => setSelectedHospital(null)}
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
                      <div className="w-10 h-10 rounded-xl bg-glass flex items-center justify-center"><MapPin className="w-5 h-5 text-blue-400" /></div>
                      <span className="text-sm font-bold">{selectedHospital.address}, {selectedHospital.lga}, {selectedHospital.state}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-glass p-8 rounded-3xl border border-glass-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck className="w-20 h-20" /></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Facility Status</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Verification</span>
                      <button 
                        onClick={() => handleToggleVerification(selectedHospital)}
                        className={`group/verify flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${selectedHospital.is_verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-accent/10 hover:border-accent hover:text-accent' : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-500'}`}
                      >
                        {selectedHospital.is_verified ? (
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
                  {selectedHospital.staff?.length > 0 ? (
                    selectedHospital.staff.map(user => (
                      <div key={user.id} className="bg-glass/30 border border-glass-border rounded-2xl p-6 flex items-center justify-between group hover:bg-glass/50 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-lg border border-blue-500/20 uppercase">
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
                            className="p-3 bg-glass hover:bg-blue-500 text-white rounded-xl transition-all border border-glass-border"
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
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500" />
                
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Modify Access</h3>
                <p className="text-text-secondary text-sm mb-8">Updating credentials for <span className="text-white font-bold">{modifyingUser.email}</span></p>
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Force Security Reset</label>
                    <button 
                      onClick={() => setForcePasswordChange(!forcePasswordChange)}
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${forcePasswordChange ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-glass border-glass-border text-text-secondary'}`}
                    >
                      <span className="font-bold text-xs">Require Setup on Next Login</span>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${forcePasswordChange ? 'bg-blue-500' : 'bg-glass-border'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${forcePasswordChange ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Emergency Password Reset</label>
                    <input 
                      type="password"
                      placeholder="Enter new security password"
                      className="w-full bg-glass border border-glass-border rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500/50 transition-all"
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
                      className="flex-1 py-4 px-6 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Commit Access
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

export default HospitalManagement;
