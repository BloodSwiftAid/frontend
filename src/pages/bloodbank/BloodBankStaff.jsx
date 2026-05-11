import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Shield, 
  Mail, 
  Phone, 
  Lock, 
  Trash2, 
  Key,
  ShieldCheck,
  MoreVertical,
  UserPlus,
  Settings,
  UserMinus,
  Unlock
} from 'lucide-react';
import { usersApi } from '../../api';
import { useIsVerified } from '../../hooks/useIsVerified';
import { toast } from 'react-hot-toast';

const BloodBankStaff = () => {
  const isVerified = useIsVerified();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [newStaff, setNewStaff] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: 'password123' // Initial password
  });

  const [editStaff, setEditStaff] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const [resetData, setResetData] = useState({
    password: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data } = await usersApi.listStaff();
      setStaff(data.results || data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error('Verification required for personnel management');
      return;
    }
    try {
      await usersApi.createStaff(newStaff);
      setShowModal(false);
      setNewStaff({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        password: 'password123'
      });
      fetchStaff();
      toast.success('Personnel onboarded successfully');
    } catch (err) {
      console.error('Failed to create staff:', err);
      toast.error('Failed to onboard staff. Protocol violation.');
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!isVerified) return;
    try {
      // Clean payload to remove empty phone or other optional fields if necessary
      const payload = { ...editStaff };
      if (!payload.phone) delete payload.phone;
      
      await usersApi.updateStaff(selectedUser.id, payload);
      setShowEditModal(false);
      fetchStaff();
      toast.success('Registry updated');
    } catch (err) {
      console.error('Failed to update staff:', err);
      toast.error('Failed to update registry.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isVerified) return;
    try {
      await usersApi.resetStaffPassword(selectedUser.id, resetData.password);
      setShowResetModal(false);
      setResetData({ password: '' });
      toast.success(`Credential reset successful for ${selectedUser.username}`);
    } catch (err) {
      console.error('Failed to reset password:', err);
      toast.error('Failed to reset credentials.');
    }
  };

  const handleToggleStatus = async (user) => {
    if (!isVerified) return;
    try {
      await usersApi.toggleStaffActive(user.id);
      toast.success(user.is_active ? 'Account suspended' : 'Account restored');
      fetchStaff();
    } catch (error) {
      toast.error('Failed to update account status');
    }
  };

  const handleToggleVerification = async (user) => {
    if (!isVerified) return;
    try {
      await usersApi.toggleStaffVerified(user.id);
      toast.success(user.is_verified ? 'Verification revoked' : 'Personnel verified');
      fetchStaff();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase">Personnel <span className="text-gradient">Directory</span></h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Shield className="w-3 h-3 text-accent" />
            Facility Permission Management
          </p>
        </div>
        <button 
          onClick={() => isVerified ? setShowModal(true) : toast.error('Verification Required')}
          disabled={!isVerified}
          className={`btn btn-primary px-8 py-4 rounded-2xl shadow-xl gap-3 group transition-all ${!isVerified ? 'opacity-40 grayscale cursor-not-allowed shadow-none' : 'shadow-accent/20'}`}
        >
          <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="font-bold tracking-tight">Onboard Staff</span>
        </button>
      </header>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : staff.map((user) => (
          <div key={user.id} className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[40px] p-8 hover:border-accent/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleToggleVerification(user)}
                title={user.is_verified ? 'Revoke Verification' : 'Verify Personnel'}
                className={`p-3 bg-glass border border-glass-border rounded-xl transition-all ${user.is_verified ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-text-muted hover:text-emerald-500'}`}
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleToggleStatus(user)}
                title={user.is_active ? 'Suspend Account' : 'Restore Account'}
                className={`p-3 bg-glass border border-glass-border rounded-xl transition-all ${user.is_active ? 'text-text-muted hover:text-accent' : 'text-accent hover:bg-accent/10'}`}
              >
                {user.is_active ? <UserMinus size={16} /> : <Unlock size={16} />}
              </button>
              <button 
                onClick={() => { 
                  if (!isVerified) return;
                  setSelectedUser(user); 
                  setEditStaff({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone || ''
                  });
                  setShowEditModal(true); 
                }}
                disabled={!isVerified}
                className={`p-3 bg-glass border border-glass-border rounded-xl text-text-muted transition-all ${!isVerified ? 'opacity-20 cursor-not-allowed' : 'hover:text-accent'}`}
              >
                <Settings className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { if (!isVerified) return; setSelectedUser(user); setShowResetModal(true); }}
                disabled={!isVerified}
                className={`p-3 bg-glass border border-glass-border rounded-xl text-text-muted transition-all ${!isVerified ? 'opacity-20 cursor-not-allowed' : 'hover:text-accent'}`}
              >
                <Key className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center font-black text-2xl text-accent border border-glass-border">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-black text-text-primary">{user.first_name} {user.last_name}</h3>
                <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">@{user.username}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-text-secondary">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-4 text-text-secondary">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">{user.phone || 'No phone set'}</span>
              </div>
              <div className="flex items-center gap-4 text-text-secondary">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">{user.role?.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-glass-border flex justify-between items-center">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.is_verified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {user.is_verified ? 'Authorized' : 'Pending Verification'}
              </span>
              {user.must_change_password && (
                <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent">
                  <Lock className="w-3 h-3" />
                  Reset Required
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-darker/80 backdrop-blur-xl" onClick={() => setShowEditModal(false)} />
          <div className="bg-card-bg border border-glass-border rounded-[48px] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-12">
              <h2 className="text-3xl font-black text-text-primary mb-2 uppercase tracking-tighter">Modify <span className="text-gradient">Operator</span></h2>
              <p className="text-text-secondary text-sm mb-10 font-bold uppercase tracking-widest">Update personnel credentials</p>

              <form onSubmit={handleUpdateStaff} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">First Name</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                      value={editStaff.first_name}
                      onChange={(e) => setEditStaff({...editStaff, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Last Name</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                      value={editStaff.last_name}
                      onChange={(e) => setEditStaff({...editStaff, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Email Address</label>
                  <input 
                    type="email"
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                    value={editStaff.email}
                    onChange={(e) => setEditStaff({...editStaff, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Phone Number</label>
                  <input 
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                    value={editStaff.phone}
                    onChange={(e) => setEditStaff({...editStaff, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2 pt-4">
                   <button className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 uppercase font-black tracking-[0.2em]">
                     Update Registry
                   </button>
                   <button 
                     type="button"
                     onClick={() => setShowEditModal(false)}
                     className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all"
                   >
                     Discard Changes
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-darker/80 backdrop-blur-xl" onClick={() => setShowModal(false)} />
          <div className="bg-card-bg border border-glass-border rounded-[48px] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-12">
              <h2 className="text-3xl font-black text-text-primary mb-2 uppercase tracking-tighter">Onboard <span className="text-gradient">Staff</span></h2>
              <p className="text-text-secondary text-sm mb-10 font-bold uppercase tracking-widest">Register a new facility operator</p>

              <form onSubmit={handleCreateStaff} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">First Name</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                      placeholder="Jane"
                      value={newStaff.first_name}
                      onChange={(e) => setNewStaff({...newStaff, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Last Name</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                      placeholder="Doe"
                      value={newStaff.last_name}
                      onChange={(e) => setNewStaff({...newStaff, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Email Address</label>
                  <input 
                    type="email"
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all"
                    placeholder="staff@swiftaid.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value, username: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Temporary Password</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                      type="text"
                      className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-14 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all font-mono"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                      required
                    />
                  </div>
                  <p className="text-[9px] text-text-muted mt-2 ml-1">Users will be forced to change this upon first authentication.</p>
                </div>

                <div className="space-y-2 pt-4">
                   <button className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 uppercase font-black tracking-[0.2em]">
                     Activate Account
                   </button>
                   <button 
                     type="button"
                     onClick={() => setShowModal(false)}
                     className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all"
                   >
                     Abort Process
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-darker/80 backdrop-blur-xl" onClick={() => setShowResetModal(false)} />
          <div className="bg-card-bg border border-glass-border rounded-[40px] w-full max-md relative z-10 overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-10">
              <h2 className="text-2xl font-black text-text-primary mb-6 uppercase tracking-tighter">Reset <span className="text-gradient">Credentials</span></h2>
              
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">New Password for {selectedUser?.username}</label>
                  <input 
                    type="text"
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 px-6 text-text-primary outline-none focus:border-accent/50 transition-all font-mono"
                    placeholder="New temp password..."
                    value={resetData.password}
                    onChange={(e) => setResetData({password: e.target.value})}
                    required
                  />
                </div>
                <button className="w-full btn btn-primary py-4 rounded-xl uppercase font-black tracking-widest text-xs">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankStaff;
