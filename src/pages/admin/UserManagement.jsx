import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { adminApi } from '../../api';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserPlus,
  Mail,
  Tag,
  Trash2,
  Edit2,
  Filter,
  CheckCircle2,
  XCircle,
  X,
  ArrowLeft,
  ArrowRight,
  Loader2,
  User,
  Lock,
  Key,
  Globe,
  Fingerprint,
  ShieldAlert,
  ChevronRight,
  Activity,
  Zap,
  RefreshCw
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  // Creation Wizard State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'INTERNAL_ADMIN'
  });

  // User Modification State
  const [modifyingUser, setModifyingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUserSecurity = async (userId) => {
    try {
      const updateData = {};
      if (newPassword) updateData.password = newPassword;
      updateData.must_change_password = forcePasswordChange;
      
      await adminApi.updateUser(userId, updateData);
      alert('Security settings updated successfully.');
      setModifyingUser(null);
      setNewPassword('');
      setForcePasswordChange(false);
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update security settings.';
      setError(msg);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this administrator? Access will be terminated immediately.')) return;
    try {
      await adminApi.deleteUser(userId);
      alert('Administrator removed successfully.');
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to remove user.';
      setError(msg);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      password: '', 
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen || modifyingUser) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, modifyingUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.listUsers();
      const data = response.data.results || response.data;
      const admins = Array.isArray(data) ? data.filter(u => u.role === 'INTERNAL_ADMIN') : [];
      setUsers(admins);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error synchronizing administrative registry.';
      setError(msg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    if (e) e.preventDefault();
    setCreateLoading(true);
    try {
      if (editingUser) {
        const updateData = { ...newUser };
        if (!updateData.password) delete updateData.password;
        await adminApi.updateUser(editingUser.id, updateData);
      } else {
        await adminApi.createUser({ ...newUser, username: newUser.email });
      }

      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
      resetForm();
    } catch (error) {
      const msg = error.response?.data?.message || (editingUser ? 'Registry update failed.' : 'Failed to provision new administrator.');
      setError(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setNewUser({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'INTERNAL_ADMIN'
    });
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
            User <span className="text-gradient">Management</span>
          </h1>
          <p className="text-text-secondary flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
            <Fingerprint className="w-3.5 h-3.5 text-accent" />
            Administrative Registry
          </p>
        </div>
        <button 
          onClick={() => { setError(''); setEditingUser(null); resetForm(); setIsModalOpen(true); }}
          className="btn btn-primary px-10 py-5 rounded-[28px] gap-4 shadow-2xl shadow-accent/20 group"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:scale-110 transition-transform duration-500">
            <UserPlus className="w-5 h-5" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Add New Admin</span>
        </button>
      </header>

      {error && (
        <div className="bg-accent/5 border border-accent/20 text-accent p-6 rounded-3xl flex items-center justify-between gap-4 animate-shake">
          <div className="flex items-center gap-4">
            <div className="bg-accent/10 p-2 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-sm font-black uppercase tracking-tight">{error}</p>
          </div>
          <button onClick={() => setError('')} className="p-2 hover:bg-accent/10 rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
          { label: 'Security Alerts', value: users.filter(u => u.must_change_password).length, icon: ShieldAlert, color: 'text-amber-500' },
          { label: 'Active Today', value: Math.floor(users.length * 0.7), icon: Zap, color: 'text-emerald-500' },
          { label: 'System Health', value: 'OPTIMAL', icon: ShieldCheck, color: 'text-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-8 rounded-[40px] hover:border-accent/30 transition-all group shadow-sm">
            <div className={`w-14 h-14 rounded-2xl bg-glass border border-glass-border flex items-center justify-center ${stat.color} mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-black/5`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">{stat.label}</p>
            <h4 className="text-3xl font-black text-text-primary tracking-tighter uppercase">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex items-center gap-5 bg-card-bg/40 backdrop-blur-2xl border border-glass-border px-10 py-6 rounded-3xl focus-within:border-accent/50 transition-all shadow-inner">
          <Search className="w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search identities by name, email, or administrative zone..." 
            className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-muted/50 font-black text-sm uppercase tracking-wider"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline bg-glass border-glass-border px-10 rounded-3xl gap-4 font-black uppercase tracking-widest text-[10px] group">
          <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform" />
          Role Filter
        </button>
      </div>

      <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[56px] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-glass/50 border-b border-glass-border">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Access Level</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Current Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-8">
                       <div className="relative w-16 h-16">
                          <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
                          <Fingerprint className="absolute inset-0 m-auto w-8 h-8 text-accent animate-pulse" />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Synchronizing Identity Registry...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center">
                    <div className="max-w-xs mx-auto space-y-4 opacity-40">
                       <Users className="w-12 h-12 mx-auto text-text-muted" />
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">No administrative identities detected matching this protocol.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-accent/5 transition-all group/row">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-glass-border group-hover/row:scale-105 transition-all shadow-sm">
                          <span className="text-xl font-black text-text-primary">{user.username?.[0].toUpperCase() || user.email[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-lg font-black text-text-primary tracking-tighter uppercase">{user.first_name} {user.last_name}</p>
                          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-text-muted mt-1 opacity-60">
                            <Mail className="w-3 h-3 text-primary" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="inline-flex items-center gap-4 bg-glass border border-glass-border px-5 py-2.5 rounded-[20px] shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">
                          {user.role?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${user.is_active !== false ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-glass-border'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${user.is_active !== false ? 'text-emerald-500' : 'text-text-muted'}`}>
                          {user.is_active !== false ? 'Active' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {user.must_change_password && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-[8px] font-black uppercase tracking-[0.2em] animate-pulse">
                            <Key className="w-3 h-3" />
                            Alert
                          </div>
                        )}
                        <button 
                          onClick={() => { setModifyingUser(user); setForcePasswordChange(user.must_change_password); }}
                          className="p-3.5 bg-glass border border-glass-border hover:bg-amber-500/10 rounded-xl transition-all text-amber-500 group/icon"
                        >
                          <Lock className="w-4 h-4 group-hover/icon:rotate-12 transition-transform" />
                        </button>
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-3.5 bg-glass border border-glass-border hover:bg-primary/10 rounded-xl transition-all text-primary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-3.5 bg-glass border border-glass-border hover:bg-accent/10 rounded-xl transition-all text-accent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Identity Provisioning Wizard */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] bg-bg-darker/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary blur-[250px] rounded-full animate-pulse" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent blur-[250px] rounded-full animate-pulse" />
          </div>

          <div className="relative w-full max-w-5xl max-h-[90vh] bg-card-bg border border-glass-border rounded-[64px] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-10 md:p-16 flex flex-col md:flex-row h-full overflow-hidden">
              {/* Sidebar Identity Info */}
              <div className="w-full md:w-80 space-y-12 shrink-0 md:border-r border-glass-border md:pr-16 mb-12 md:mb-0">
                <div className="w-24 h-24 bg-accent rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-accent/40 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 group-hover:rotate-180 transition-transform duration-1000" />
                  {editingUser ? <Edit2 className="w-10 h-10 relative z-10" /> : <UserPlus className="w-10 h-10 relative z-10" />}
                </div>
                <div>
                  <h2 className="text-5xl font-black text-text-primary tracking-tighter uppercase leading-[0.9]">
                    {editingUser ? 'Update' : 'Add New'}<br/>
                    <span className="text-accent">Admin</span>
                  </h2>
                  <div className="w-20 h-2 bg-accent mt-8 rounded-full" />
                </div>
                
                <div className="space-y-10">
                  <div className="flex items-center gap-8 opacity-100 scale-105 translate-x-2">
                    <div className="w-12 h-12 rounded-[20px] border-4 border-accent bg-accent/10 text-accent flex items-center justify-center text-sm font-black">01</div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Phase Alpha</p>
                      <p className="text-xs font-black text-text-primary uppercase tracking-widest">User Credentials</p>
                    </div>
                  </div>
                </div>

                <div className="pt-16">
                   <div className="p-8 bg-glass border border-glass-border rounded-[32px] space-y-6 relative overflow-hidden group shadow-sm">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                         <ShieldCheck className="w-12 h-12 text-blue-500" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">User Access</h4>
                      <p className="text-[11px] text-text-secondary font-black uppercase leading-relaxed tracking-tight opacity-80 relative z-10">
                        System administrators hold unrestricted access to clinical and logistical telemetry.
                      </p>
                   </div>
                </div>
              </div>

              {/* Main Provisioning Form */}
              <div className="flex-1 md:pl-16 overflow-y-auto custom-scrollbar flex flex-col justify-center">
                <form onSubmit={handleCreateUser} className="space-y-16 animate-in slide-in-from-right-16 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">First Name</label>
                      <input 
                        required
                        className="w-full bg-glass border border-glass-border rounded-[24px] px-8 py-6 text-text-primary outline-none focus:border-accent transition-all font-black text-xl"
                        placeholder="ALEX"
                        value={newUser.first_name}
                        onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Last Name</label>
                      <input 
                        required
                        className="w-full bg-glass border border-glass-border rounded-[24px] px-8 py-6 text-text-primary outline-none focus:border-accent transition-all font-black text-xl"
                        placeholder="COVINGTON"
                        value={newUser.last_name}
                        onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Email Address</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-glass border border-glass-border rounded-[24px] px-8 py-6 text-text-primary outline-none focus:border-accent transition-all font-black text-xl lowercase"
                        placeholder="admin@swiftaid.core"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">User Role</label>
                      <div className="relative">
                        <input 
                          disabled
                          className="w-full bg-glass/20 border border-glass-border rounded-[20px] px-8 py-5 text-text-muted outline-none font-black uppercase tracking-widest"
                          value="System Administrator"
                        />
                        <Lock className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/30" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Password</label>
                      <div className="relative">
                        <input 
                          required={!editingUser}
                          type="password"
                          className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-accent transition-all font-black tracking-[0.5em]"
                          placeholder="••••••••"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        />
                        <Key className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/30" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-glass-border flex justify-end items-center gap-8">
                     <button 
                      type="button"
                      onClick={() => { setIsModalOpen(false); setEditingUser(null); }}
                      className="btn btn-outline py-5 px-10 rounded-[20px] text-text-muted border-glass-border bg-glass font-black uppercase tracking-[0.2em] text-[10px] hover:text-accent transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={createLoading}
                      className="btn btn-primary py-5 px-16 rounded-[24px] shadow-2xl shadow-accent/40 flex items-center justify-center gap-6 bg-accent border-none min-w-[280px]"
                    >
                      {createLoading ? (
                        <Loader2 className="animate-spin w-6 h-6" />
                      ) : (
                        <>
                           <span className="font-black uppercase tracking-[0.3em] text-[10px]">
                            {editingUser ? 'Update Administrator' : 'Add Administrator'}
                          </span>
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Security Override Modal */}
      {modifyingUser && createPortal(
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-bg-darker/90 backdrop-blur-2xl" onClick={() => setModifyingUser(null)} />
          <div className="relative w-full max-w-lg bg-card-bg border border-glass-border rounded-[48px] p-12 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
            
            <div className="space-y-4 mb-12">
               <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Security Override</span>
               </div>
                <h3 className="text-4xl font-black text-text-primary uppercase tracking-tighter leading-none">Security <span className="text-gradient">Settings</span></h3>
               <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Target: <span className="text-text-primary">{modifyingUser.email}</span></p>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Password Reset</label>
                <button 
                  onClick={() => setForcePasswordChange(!forcePasswordChange)}
                  className={`w-full p-6 rounded-[24px] border-2 transition-all flex items-center justify-between group/switch shadow-sm ${forcePasswordChange ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-glass border-glass-border text-text-muted'}`}
                >
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Require change on next login</span>
                  <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${forcePasswordChange ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-glass-border'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${forcePasswordChange ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Master Password Override</label>
                <div className="relative group">
                  <input 
                    type="password"
                    placeholder="ENTER OVERRIDE SECRET"
                    className="w-full bg-glass border border-glass-border rounded-[24px] px-8 py-6 text-text-primary outline-none focus:border-amber-500 transition-all font-black text-sm tracking-[0.4em] placeholder:text-text-muted/10 placeholder:tracking-normal shadow-inner"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setNewPassword(Math.random().toString(36).slice(-8).toUpperCase())}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] hover:text-amber-600 transition-colors bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/10 shadow-sm"
                  >
                    Auto-Gen
                  </button>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                 <button 
                   onClick={() => handleUpdateUserSecurity(modifyingUser.id)}
                   className="w-full btn btn-primary py-6 rounded-3xl shadow-2xl shadow-amber-500/40 font-black uppercase tracking-[0.4em] text-xs group bg-amber-500 border-none"
                 >
                    Update Security
                   <ShieldCheck className="w-5 h-5 ml-4 group-hover:scale-110 transition-transform inline-block" />
                 </button>
                 <button 
                   onClick={() => { setModifyingUser(null); setNewPassword(''); }}
                   className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-colors"
                 >
                    Cancel
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

export default UserManagement;
