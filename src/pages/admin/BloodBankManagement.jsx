import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { adminApi } from '../../api';
import { toast } from 'react-hot-toast';
import { 
  LayoutGrid,
  Settings,
  Key,
  UserMinus,
  Unlock,
  Trash,
  Globe,
  Plus,
  Search,
  MapPin,
  Building2,
  User,
  Activity,
  ShieldCheck,
  Database,
  Droplet,
  ChevronRight,
  Zap,
  X,
  Weight
} from 'lucide-react';
import LocationSelector from '../../components/LocationSelector';

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
  
  // Portal State
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState('overview'); // overview, personnel, finance
  const [portalData, setPortalData] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    email: '', password: '', first_name: '', last_name: ''
  });

  // User Modification State
  const [modifyingUser, setModifyingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  // Inventory State
  const [bankInventory, setBankInventory] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  useEffect(() => {
    if (isPortalOpen && portalTab === 'inventory' && portalData) {
      fetchBankInventory(portalData.id);
    }
  }, [isPortalOpen, portalTab, portalData]);

  const fetchBankInventory = async (id) => {
    setInventoryLoading(true);
    try {
      const res = await adminApi.getBloodBankInventory(id);
      setBankInventory(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setInventoryLoading(false);
    }
  };

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
      
      // Update portal data if open
      if (portalData) {
        const updated = data.find(b => b.id === portalData.id);
        if (updated) setPortalData(updated);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error fetching blood bank data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const [newOrg, setNewOrg] = useState({
    name: '', address: '', state: '', area: '', contact_email: '', contact_phone: '',
    license_number: '', storage_capacity_liters: 0, commission_percentage: 10.0, country: '', city: ''
  });
  
  const [newAdmin, setNewAdmin] = useState({
    email: '', password: '', first_name: '', last_name: '', role: 'BLOODBANK_ADMIN'
  });

  useEffect(() => {
    if (isModalOpen || isPortalOpen || isStaffModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen, isPortalOpen, isStaffModalOpen]);

  const handlePortalUpdate = async () => {
    setLoading(true);
    try {
      const { staff, ...updateData } = portalData;
      await adminApi.updateBloodBank(portalData.id, updateData);
      toast.success('Settings updated successfully.');
      fetchData();
    } catch (err) {
      toast.error('Update failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserActive = async (user) => {
    try {
      await adminApi.toggleUserActive(user.id);
      toast.success(user.is_active ? 'Account suspended.' : 'Account restored.');
      fetchData();
    } catch (err) {
      toast.error('Toggle failure.');
    }
  };

  const handleToggleUserVerified = async (user) => {
    try {
      await adminApi.toggleUserVerified(user.id);
      toast.success(user.is_verified ? 'Identity unverified.' : 'Identity verified.');
      fetchData();
    } catch (err) {
      toast.error('Verification toggle failure.');
    }
  };

  const handleAddStaff = async (e) => {
    if (e) e.preventDefault();
    if (!newStaffData.email || !newStaffData.password) {
      toast.error('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const userRes = await adminApi.createUser({
        ...newStaffData,
        username: newStaffData.email,
        role: 'BLOODBANK_STAFF'
      });
      await adminApi.createProfile({
        user_id: userRes.data.id,
        blood_bank_id: portalData.id
      });
      toast.success('Staff member added successfully.');
      setIsStaffModalOpen(false);
      setNewStaffData({ email: '', password: '', first_name: '', last_name: '' });
      fetchData();
    } catch (err) {
      toast.error('Registration failed. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete staff member record?')) return;
    try {
      await adminApi.deleteUser(userId);
      toast.success('Staff member removed.');
      fetchData();
    } catch (err) {
      toast.error('Deletion failure.');
    }
  };

  const handlePasswordReset = async (userId) => {
    const password = prompt('Enter new override secret:');
    if (!password) return;
    try {
      await adminApi.updateUser(userId, { password });
      toast.success('Secret reset complete.');
    } catch (err) {
      toast.error('Reset failed.');
    }
  };

  const openPortal = (bank) => {
    setPortalData({ ...bank });
    setPortalTab('overview');
    setIsPortalOpen(true);
  };

  const handleOnboard = async (e) => {
    if (e) e.preventDefault();
    if (!newOrg.name || !newOrg.license_number || !newOrg.state || !newOrg.area || !newOrg.country || !newOrg.address) {
      toast.error('All facility fields (Name, License, State, LGA, Country, Address) are required.');
      return;
    }
    if (!newAdmin.email || !newAdmin.first_name || !newAdmin.last_name || !newAdmin.password) {
      toast.error('All admin fields (Email, First Name, Last Name, Password) are required.');
      return;
    }
    setLoading(true);
    try {
      const orgRes = await adminApi.createBloodBank(newOrg);
      const orgId = orgRes.data.id;
      const userRes = await adminApi.createUser({
        ...newAdmin,
        username: newAdmin.email,
        email: newAdmin.email || 'contact@bloodbank.com'
      });
      await adminApi.createProfile({
        user_id: userRes.data.id,
        blood_bank_id: orgId
      });
      setIsModalOpen(false);
      fetchData();
      toast.success('Blood bank and administrator registered.');
      setNewOrg({ name: '', license_number: '', address: '', state: '', area: '' });
      setNewAdmin({ email: '', password: '', first_name: '', last_name: '', role: 'BLOODBANK_ADMIN' });
    } catch (err) {
      toast.error('Registration failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setNewOrg({ name: '', address: '', state: '', area: '', contact_email: '', contact_phone: '', license_number: '', storage_capacity_liters: 0, commission_percentage: 10.0 });
    setNewAdmin({ email: '', password: '', first_name: '', last_name: '', role: 'BLOODBANK_ADMIN' });
    setCurrentStep(1);
  };

  const filteredBanks = Array.isArray(bloodBanks) ? bloodBanks.filter(bank => 
    bank?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank?.state?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            Blood <span className="text-primary">Banks</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
            <Globe size={14} className="text-primary" />
            Facility List
          </p>
        </div>
        <button 
          onClick={() => { setError(''); resetForms(); setIsModalOpen(true); }}
          className="btn btn-primary px-8 py-5 rounded-[28px] gap-3 shadow-xl group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-black uppercase tracking-widest text-[10px]">Onboard Facility</span>
        </button>
      </header>

      {/* Executive Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Facilities', value: stats.blood_banks, icon: Building2, color: 'text-primary' },
          { label: 'Total Capacity', value: `${bloodBanks.reduce((acc, b) => acc + (parseFloat(b.storage_capacity_liters) || 0), 0)}L`, icon: Weight, color: 'text-emerald-500' },
          { label: 'Staff', value: stats.total_users, icon: User, color: 'text-accent' },
          { label: 'Verifications', value: stats.pending_verifications, icon: Activity, color: 'text-amber-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-8 rounded-[40px] shadow-sm flex flex-col justify-between">
            <div className={`w-14 h-14 rounded-2xl bg-glass border border-glass-border flex items-center justify-center ${stat.color} mb-8 shadow-inner`}>
              <stat.icon size={28} />
            </div>
            <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 opacity-60">{stat.label}</p>
               <h4 className="text-3xl font-black text-text-primary tracking-tighter tabular-nums">{stat.value || 0}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 flex items-center gap-4 bg-card-bg/40 backdrop-blur-2xl border border-glass-border px-10 py-6 rounded-3xl shadow-inner">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input 
            type="text" 
            placeholder="Search blood banks..." 
            className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-muted/30 font-black text-sm uppercase tracking-wider"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredBanks.map((bank) => (
          <div 
            key={bank.id} 
            onClick={() => openPortal(bank)}
            className="group bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[56px] p-12 hover:border-primary/40 transition-all duration-500 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Building2 size={32} />
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${bank.is_verified ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                {bank.is_verified ? <ShieldCheck size={12}/> : <Activity size={12}/>}
                {bank.is_verified ? 'Verified' : 'Pending Review'}
              </div>
            </div>
            
            <h3 
              className="font-black text-text-primary mb-4 tracking-tighter uppercase"
              style={{ fontSize: (bank.name || '').length > 25 ? '1.25rem' : (bank.name || '').length > 18 ? '1.5rem' : '1.875rem' }}
            >
              {bank.name}
            </h3>
            
            <div className="space-y-4 mb-12 opacity-80">
              <div className="flex items-start gap-3 text-[11px] text-text-secondary">
                <MapPin size={20} className="text-primary/60 shrink-0" />
                <span className="font-black uppercase tracking-tight line-clamp-2">{bank.address}, {bank.state}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-glass-border flex justify-between items-center">
              <button 
                onClick={(e) => { e.stopPropagation(); adminApi.toggleBloodBankVerified(bank.id).then(fetchData); }}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all cursor-pointer ${bank.is_verified ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500' : 'bg-glass border border-glass-border hover:border-emerald-500/50 text-text-muted hover:text-emerald-500'}`}
              >
                <ShieldCheck size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest">{bank.is_verified ? 'Authorized Node' : 'Verify Facility'}</span>
              </button>
              <ChevronRight className="text-primary group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Full Facility Intelligence Portal */}
      {isPortalOpen && portalData && createPortal(
        <div className="fixed inset-0 z-[3000] bg-bg-darker flex items-center justify-center animate-in fade-in duration-500 overflow-hidden">
          <div className="w-full h-full flex flex-col md:flex-row">
            {/* Control Sidebar */}
            <div className="w-full md:w-80 lg:w-96 bg-card-bg border-r border-glass-border flex flex-col p-12 shrink-0">
              <div className="mb-16">
                <div className="w-24 h-24 bg-primary/10 border-2 border-primary/20 rounded-[32px] flex items-center justify-center text-primary mb-8 shadow-xl">
                  <Activity size={48} />
                </div>
                <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-[0.9]">
                  Facility<br />
                  <span className="text-primary">Oversight</span>
                </h2>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutGrid },
                  { id: 'personnel', label: 'Staff', icon: User },
                  { id: 'inventory', label: 'Inventory', icon: Droplet },
                  { id: 'security', label: 'Directives', icon: ShieldCheck }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setPortalTab(tab.id)}
                    className={`w-full p-6 rounded-3xl flex items-center gap-6 transition-all ${portalTab === tab.id ? 'bg-primary border-2 border-primary shadow-2xl shadow-primary/20 text-bg-dark' : 'bg-glass border border-glass-border text-text-secondary hover:border-primary/30'}`}
                  >
                    <tab.icon size={24} />
                    <span className="font-black uppercase tracking-widest text-[10px]">{tab.label}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setIsPortalOpen(false)}
                className="mt-12 w-full p-6 bg-glass border border-glass-border rounded-3xl text-text-muted hover:text-accent hover:border-accent/30 transition-all font-black uppercase tracking-widest text-[10px]"
              >
                Close Panel
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8 md:p-20 custom-scrollbar bg-bg-darker relative">
              <div className="max-w-4xl mx-auto space-y-20">
                <header className="flex justify-between items-start">
                  <div>
                    <h3 className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter uppercase leading-none mb-4">{portalData.name}</h3>
                    <div className="flex gap-4">
                      <div className="px-4 py-1.5 bg-primary/5 border border-primary/20 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest">{portalData.license_number}</div>
                      <div className="px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Node</div>
                    </div>
                  </div>
                </header>

                {portalTab === 'overview' && (
                  <div className="space-y-12 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3 md:col-span-2">
                        <label className="label-text">Facility Nomenclature</label>
                        <input className="portal-input text-2xl font-black uppercase tracking-tight" placeholder="Enter Facility Name" value={portalData.name} onChange={e => setPortalData({...portalData, name: e.target.value})} />
                      </div>
                      
                      <div className="md:col-span-2 pt-6">
                        <div className="h-px bg-gradient-to-r from-glass-border to-transparent mb-10" />
                        <label className="label-text">Physical Coordination</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-3">
                            <input className="portal-input" placeholder="Full Physical Address" value={portalData.address} onChange={e => setPortalData({...portalData, address: e.target.value})} />
                          </div>
                          <div>
                            <input className="portal-input" placeholder="Administrative State" value={portalData.state} onChange={e => setPortalData({...portalData, state: e.target.value})} />
                          </div>
                          <div>
                            <input className="portal-input" placeholder="Local Government Area" value={portalData.area || ''} onChange={e => setPortalData({...portalData, area: e.target.value})} />
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 pt-6">
                        <div className="h-px bg-gradient-to-r from-glass-border to-transparent mb-10" />
                        <label className="label-text">Primary Contacts</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <input className="portal-input" placeholder="Contact Person Name" value={portalData.contact_name || ''} onChange={e => setPortalData({...portalData, contact_name: e.target.value})} />
                          </div>
                          <div>
                            <input className="portal-input" placeholder="Official Email Address" value={portalData.contact_email || ''} onChange={e => setPortalData({...portalData, contact_email: e.target.value})} />
                          </div>
                          <div>
                            <input className="portal-input" placeholder="Emergency Phone Line" value={portalData.contact_phone || ''} onChange={e => setPortalData({...portalData, contact_phone: e.target.value})} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-10 flex justify-end">
                      <button onClick={handlePortalUpdate} className="btn btn-primary px-16 py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-[1.02] transition-transform">
                        Update
                      </button>
                    </div>
                  </div>
                )}

                {portalTab === 'personnel' && (
                  <div className="space-y-10 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h4 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Staff Directory</h4>
                      <button 
                        onClick={() => setIsStaffModalOpen(true)}
                        className="btn btn-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                      >
                        <Plus size={16} /> Add Staff
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {portalData.staff?.map(user => (
                        <div key={user.id} className="bg-glass/5 border border-glass-border p-8 rounded-[40px] flex items-center justify-between group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-[28px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-3xl font-black uppercase">
                              {user.first_name?.[0] || user.email[0]}
                            </div>
                            <div>
                              <h5 className="text-2xl font-black text-text-primary uppercase tracking-tighter">{user.first_name} {user.last_name}</h5>
                              <p className="text-[10px] font-black text-text-muted tracking-widest normal-case">{user.email} // {user.role.replace('_', ' ')}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {!user.is_verified && <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[8px] font-black text-amber-500 uppercase tracking-widest">Identity Pending</span>}
                                {!user.is_active && <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-[8px] font-black text-accent uppercase tracking-widest">Account Suspended</span>}
                                {user.is_active && user.is_verified && <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[8px] font-black text-emerald-500 uppercase tracking-widest">Authorized Staff</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button onClick={() => handleToggleUserVerified(user)} title={user.is_verified ? 'Revoke Verification' : 'Grant Verification'} className={`p-4 bg-glass border border-glass-border rounded-2xl transition-all ${user.is_verified ? 'text-emerald-500 shadow-lg shadow-emerald-500/10' : 'text-text-muted hover:text-emerald-500'}`}><ShieldCheck size={20} /></button>
                            <button onClick={() => handlePasswordReset(user.id)} title="Reset Password" className="p-4 bg-glass border border-glass-border rounded-2xl text-text-muted hover:text-primary transition-all"><Key size={20} /></button>
                            <button onClick={() => handleToggleUserActive(user)} title={user.is_active ? 'Deactivate' : 'Activate'} className={`p-4 bg-glass border border-glass-border rounded-2xl transition-all ${user.is_active ? 'text-text-muted hover:text-accent' : 'text-accent hover:bg-accent hover:text-white'}`}>{user.is_active ? <UserMinus size={20} /> : <Unlock size={20} />}</button>
                            <button onClick={() => handleDeleteUser(user.id)} title="Delete Personnel" className="p-4 bg-glass border border-glass-border rounded-2xl text-text-muted hover:text-accent hover:border-accent transition-all"><Trash size={20} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {portalTab === 'inventory' && (
                  <div className="space-y-10 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-glass-border pb-6">
                      <h4 className="text-2xl font-black text-text-primary uppercase tracking-tighter flex items-center gap-4">
                        <Database size={24} className="text-primary" />
                        Blood Inventory
                      </h4>
                    </div>
                    {inventoryLoading || !bankInventory ? (
                      <div className="flex justify-center py-20">
                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : bankInventory.length === 0 ? (
                      <div className="bg-glass/5 border border-glass-border p-12 rounded-[40px] text-center space-y-4">
                        <Droplet size={48} className="mx-auto text-text-muted opacity-50" />
                        <h5 className="text-xl font-black text-text-primary uppercase">No Inventory Found</h5>
                        <p className="text-text-secondary font-bold uppercase tracking-widest text-[10px]">This facility hasn't recorded any blood bags yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bankInventory.map((item, idx) => (
                          <div key={idx} className="bg-glass/5 border border-glass-border p-8 rounded-[40px] flex items-center justify-between group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-[24px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-2xl uppercase shadow-inner">
                                {item.blood_group}
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Stock Level</p>
                                <div className="text-3xl font-black text-text-primary tracking-tighter tabular-nums">{item.quantity}<span className="text-sm text-text-muted ml-1">Units</span></div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                               <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Base Price</p>
                               <span className="text-xl font-black text-emerald-500 tabular-nums tracking-tighter">₦{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {portalTab === 'security' && (
                  <div className="space-y-12 animate-fade-in">
                    <div className="p-12 bg-glass border border-glass-border rounded-[56px] space-y-12">
                      <div className="flex justify-between items-center pb-12 border-b border-glass-border">
                        <div>
                          <p className="text-[10px] font-black text-text-primary uppercase tracking-widest mb-1">Verification Status</p>
                          <p className="text-[9px] text-text-muted uppercase font-black opacity-60">Control blood bank marketplace access</p>
                        </div>
                        <button onClick={() => adminApi.toggleBloodBankVerified(portalData.id).then(fetchData)} className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 ${portalData.is_verified ? 'bg-emerald-500 text-bg-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-glass border border-glass-border text-text-muted hover:text-emerald-500 hover:border-emerald-500/50'}`}>
                          <ShieldCheck size={16} />
                          {portalData.is_verified ? 'Authorized Node' : 'Grant Verification'}
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black text-text-primary uppercase tracking-widest mb-1">Operational Status</p>
                          <p className="text-[9px] text-text-muted uppercase font-black opacity-60">Toggle node visibility in network</p>
                        </div>
                        <button onClick={() => adminApi.toggleBloodBankActive(portalData.id).then(fetchData)} className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${portalData.is_active !== false ? 'bg-primary text-bg-dark shadow-xl' : 'bg-glass border border-glass-border text-text-muted'}`}>
                          {portalData.is_active !== false ? 'Online' : 'Offline'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Onboarding Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] bg-bg-darker/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="relative w-full max-w-5xl bg-card-bg border border-glass-border rounded-[64px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            <div className="p-16 flex flex-col md:flex-row gap-20">
               <div className="w-80 space-y-12 shrink-0">
                  <div className="w-24 h-24 bg-primary/10 border-2 border-primary/20 rounded-[32px] flex items-center justify-center text-primary shadow-xl">
                    <Plus size={48} />
                  </div>
                  <h2 className="text-5xl font-black text-text-primary tracking-tighter uppercase leading-[0.9]">Register<br />Facility</h2>
                  <div className="space-y-10">
                     <div className={`flex items-center gap-6 ${currentStep === 1 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="w-12 h-12 rounded-[20px] bg-primary/10 border-2 border-primary text-primary flex items-center justify-center font-black text-xs">01</div>
                        <span className="font-black uppercase tracking-widest text-[10px] text-text-primary">Facility Data</span>
                     </div>
                     <div className={`flex items-center gap-6 ${currentStep === 2 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="w-12 h-12 rounded-[20px] bg-glass border-2 border-glass-border text-text-muted flex items-center justify-center font-black text-xs">02</div>
                        <span className="font-black uppercase tracking-widest text-[10px] text-text-primary">Admin Access</span>
                     </div>
                  </div>
               </div>

               <div className="flex-1 space-y-10">
                  {currentStep === 1 ? (
                    <div className="grid grid-cols-2 gap-8 animate-fade-in">
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Facility Name</label>
                          <input className="portal-input" value={newOrg.name} onChange={e => setNewOrg({...newOrg, name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="label-text">License Number</label>
                          <input className="portal-input" value={newOrg.license_number} onChange={e => setNewOrg({...newOrg, license_number: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="label-text">Capacity (L)</label>
                          <input className="portal-input" type="number" value={newOrg.storage_capacity_liters} onChange={e => setNewOrg({...newOrg, storage_capacity_liters: e.target.value})} />
                       </div>
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Address</label>
                          <input className="portal-input" value={newOrg.address} onChange={e => setNewOrg({...newOrg, address: e.target.value})} />
                       </div>
                       <LocationSelector
                          country={newOrg.country} setCountry={v => setNewOrg(prev => ({...prev, country: v}))}
                          state={newOrg.state} setState={v => setNewOrg(prev => ({...prev, state: v}))}
                          lga={newOrg.area} setLga={v => setNewOrg(prev => ({...prev, area: v}))}
                          city={newOrg.city} setCity={v => setNewOrg(prev => ({...prev, city: v}))}
                       />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-8 animate-fade-in">
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Admin Email</label>
                          <input className="portal-input" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="label-text">First Name</label>
                          <input className="portal-input" value={newAdmin.first_name} onChange={e => setNewAdmin({...newAdmin, first_name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="label-text">Last Name</label>
                          <input className="portal-input" value={newAdmin.last_name} onChange={e => setNewAdmin({...newAdmin, last_name: e.target.value})} />
                       </div>
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Secret Code (Password)</label>
                          <input className="portal-input" type="password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
                       </div>
                    </div>
                  )}

                  <div className="pt-12 border-t border-glass-border flex justify-between">
                     <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-text-muted font-black uppercase text-[10px]">Cancel</button>
                     <div className="flex gap-4">
                        {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-8 py-4 border border-glass-border rounded-2xl text-text-primary font-black uppercase text-[10px]">Back</button>}
                         <button onClick={currentStep === 1 ? () => { if(!newOrg.name || !newOrg.license_number || !newOrg.state || !newOrg.area || !newOrg.country || !newOrg.address) { toast.error('All facility fields (Name, License, State, LGA, Country, Address) are required.'); } else { setCurrentStep(2); } } : handleOnboard} className="btn btn-primary px-12 py-5 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px]">
                           {currentStep === 1 ? 'Next Step' : 'Confirm Registration'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Staff Addition Modal */}
      {isStaffModalOpen && createPortal(
        <div className="fixed inset-0 z-[4000] bg-bg-darker/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="relative w-full max-w-xl bg-card-bg border border-glass-border rounded-[48px] shadow-2xl flex flex-col overflow-hidden animate-scale-up p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                   <h3 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-1">Add Staff Member</h3>
                   <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Add staff to {portalData?.name}</p>
                </div>
                <button onClick={() => setIsStaffModalOpen(false)} className="p-3 bg-glass border border-glass-border rounded-xl text-text-muted hover:text-accent transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="label-text">First Name</label>
                    <input className="portal-input" value={newStaffData.first_name} onChange={e => setNewStaffData({...newStaffData, first_name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="label-text">Last Name</label>
                    <input className="portal-input" value={newStaffData.last_name} onChange={e => setNewStaffData({...newStaffData, last_name: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label-text">Email (Username)</label>
                  <input className="portal-input" type="email" value={newStaffData.email} onChange={e => setNewStaffData({...newStaffData, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="label-text">Temporary Secret (Password)</label>
                  <input className="portal-input" type="password" value={newStaffData.password} onChange={e => setNewStaffData({...newStaffData, password: e.target.value})} required />
                </div>

                <div className="pt-6">
                   <button type="submit" disabled={loading} className="w-full btn btn-primary py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                      {loading ? 'Processing...' : 'Complete Registration'}
                   </button>
                </div>
              </form>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default BloodBankManagement;
