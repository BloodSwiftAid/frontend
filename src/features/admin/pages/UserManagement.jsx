import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserPlus,
  Mail,
  Trash2,
  Edit2,
  Filter,
  X,
  ArrowLeft,
  Loader2,
  Lock,
  Fingerprint,
  ShieldAlert,
  Zap,
  UserMinus,
  Unlock,
  ChevronDown,
  Activity,
  BadgeCheck
} from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'ALL', label: 'All Users' },
  { value: 'INTERNAL_ADMIN', label: 'Internal Admin' },
  { value: 'HOSPITAL_ADMIN', label: 'Hospital Admin' },
  { value: 'HOSPITAL_STAFF', label: 'Hospital Staff' },
  { value: 'BLOODBANK_ADMIN', label: 'Blood Bank Admin' },
  { value: 'BLOODBANK_STAFF', label: 'Blood Bank Staff' },
  { value: 'PUBLIC_USER', label: 'Public User' },
  { value: 'DISPATCH_RIDER', label: 'Dispatch Rider' },
];

const ROLE_COLORS = {
  INTERNAL_ADMIN: 'text-primary border-primary/30 bg-primary/10',
  HOSPITAL_ADMIN: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  HOSPITAL_STAFF: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  BLOODBANK_ADMIN: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
  BLOODBANK_STAFF: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  PUBLIC_USER: 'text-text-muted border-glass-border bg-glass',
  DISPATCH_RIDER: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  
  // Creation / Edit Wizard State
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

  // Security Override State
  const [modifyingUser, setModifyingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.listUsers();
      const data = response.data.results || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load users.';
      setError(msg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user) => {
    setTogglingId(`active-${user.id}`);
    try {
      await adminApi.toggleUserActive(user.id);
      toast.success(user.is_active ? `${user.first_name || user.email} suspended.` : `${user.first_name || user.email} activated.`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update account status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleVerified = async (user) => {
    setTogglingId(`verified-${user.id}`);
    try {
      await adminApi.toggleUserVerified(user.id);
      toast.success(user.is_verified ? 'Verification revoked.' : 'User verified successfully.');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update verification status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleUpdateUserSecurity = async (userId) => {
    try {
      const updateData = {};
      if (newPassword) updateData.password = newPassword;
      updateData.must_change_password = forcePasswordChange;
      await adminApi.updateUser(userId, updateData);
      toast.success('Security settings updated.');
      setModifyingUser(null);
      setNewPassword('');
      setForcePasswordChange(false);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update security settings.';
      setError(msg);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Remove this user? Their access will be terminated immediately.')) return;
    try {
      await adminApi.deleteUser(userId);
      toast.success('User removed successfully.');
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove user.';
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
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, modifyingUser]);

  const handleCreateUser = async (e) => {
    if (e) e.preventDefault();
    setCreateLoading(true);
    try {
      if (editingUser) {
        const updateData = { ...newUser };
        if (!updateData.password) delete updateData.password;
        await adminApi.updateUser(editingUser.id, updateData);
        toast.success('User updated successfully.');
      } else {
        await adminApi.createUser({ ...newUser, username: newUser.email });
        toast.success('New user created successfully.');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.message || (editingUser ? 'Update failed.' : 'Failed to create user.');
      setError(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setNewUser({ email: '', password: '', first_name: '', last_name: '', role: 'INTERNAL_ADMIN' });
  };

  // Filter by role then by search term
  const filteredUsers = users
    .filter(u => roleFilter === 'ALL' || u.role === roleFilter)
    .filter(u =>
      u?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const activeCount = users.filter(u => u.is_active !== false).length;
  const verifiedCount = users.filter(u => u.is_verified).length;
  const pendingCount = users.filter(u => u.must_change_password).length;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-glass border border-glass-border rounded-2xl hover:text-accent transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
              User <span className="text-primary">Management</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
              <Fingerprint className="w-3.5 h-3.5 text-primary" />
              All Users Directory
            </p>
          </div>
        </div>
        <button 
          onClick={() => { setError(''); setEditingUser(null); resetForm(); setIsModalOpen(true); }}
          className="w-full md:w-auto btn btn-primary px-8 py-4 rounded-xl md:rounded-[28px] gap-3 shadow-xl group"
        >
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-black uppercase tracking-widest text-[10px]">Add New User</span>
        </button>
      </header>

      {error && (
        <div className="bg-accent/5 border border-accent/20 text-accent p-6 rounded-2xl flex items-center justify-between gap-4 animate-shake">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p className="text-[11px] font-black uppercase tracking-tight">{error}</p>
          </div>
          <button onClick={() => setError('')} className="p-2 hover:bg-accent/10 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
          { label: 'Active Accounts', value: activeCount, icon: Activity, color: 'text-emerald-500' },
          { label: 'Verified Users', value: verifiedCount, icon: BadgeCheck, color: 'text-blue-400' },
          { label: 'Pending Reset', value: pendingCount, icon: ShieldAlert, color: 'text-accent' },
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-6 md:p-8 rounded-3xl md:rounded-[40px] shadow-sm">
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-glass border border-glass-border flex items-center justify-center ${stat.color} mb-4 md:mb-8`}>
              <stat.icon className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">{stat.label}</p>
            <h4 className="text-xl md:text-2xl lg:text-3xl font-black text-text-primary tracking-tighter">{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Search & Role Filter */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1 flex items-center gap-4 bg-card-bg/40 backdrop-blur-2xl border border-glass-border px-6 py-4 md:px-10 md:py-6 rounded-2xl md:rounded-3xl shadow-inner">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-muted/40 font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 bg-card-bg/40 backdrop-blur-2xl border border-glass-border px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl shadow-inner cursor-pointer">
            <Filter className="w-4 h-4 text-primary shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-text-primary font-black text-[10px] uppercase tracking-widest cursor-pointer appearance-none pr-6"
            >
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-bg-darker text-text-primary">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-text-muted absolute right-6 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-3xl md:rounded-[56px] overflow-hidden shadow-2xl relative">
        
        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-glass/50 border-b border-glass-border">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Account Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Verification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-40">No users found.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-primary/5 transition-all group/row">
                    {/* User Details */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/row:scale-105 transition-all shrink-0">
                          <span className="text-base font-black text-primary">
                            {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-text-primary tracking-tight">
                            {user.first_name} {user.last_name}
                          </p>
                          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-text-muted mt-0.5">
                            <Mail className="w-3 h-3 text-primary/60" />
                            <span className="normal-case">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-2 border px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${ROLE_COLORS[user.role] || 'text-text-muted border-glass-border bg-glass'}`}>
                        {user.role?.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${user.is_active !== false ? 'bg-emerald-500 animate-pulse' : 'bg-accent'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_active !== false ? 'text-emerald-500' : 'text-accent'}`}>
                          {user.is_active !== false ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${user.is_verified ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-amber-400 border-amber-400/30 bg-amber-400/10'}`}>
                        <ShieldCheck className="w-3 h-3" />
                        {user.is_verified ? 'Verified' : 'Pending KYC'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggleActive(user)}
                          disabled={togglingId === `active-${user.id}`}
                          title={user.is_active !== false ? 'Suspend Account' : 'Activate Account'}
                          className={`p-2.5 bg-glass border border-glass-border rounded-xl transition-all ${user.is_active !== false ? 'text-text-muted hover:text-accent hover:border-accent/30' : 'text-accent hover:bg-accent hover:text-white'}`}
                        >
                          {togglingId === `active-${user.id}` 
                            ? <Loader2 size={15} className="animate-spin" /> 
                            : user.is_active !== false ? <UserMinus size={15} /> : <Unlock size={15} />}
                        </button>

                        {/* Toggle Verified */}
                        <button
                          onClick={() => handleToggleVerified(user)}
                          disabled={togglingId === `verified-${user.id}`}
                          title={user.is_verified ? 'Revoke Verification' : 'Verify User'}
                          className={`p-2.5 bg-glass border border-glass-border rounded-xl transition-all ${user.is_verified ? 'text-emerald-500 shadow-lg shadow-emerald-500/10 hover:text-text-muted' : 'text-text-muted hover:text-emerald-500'}`}
                        >
                          {togglingId === `verified-${user.id}`
                            ? <Loader2 size={15} className="animate-spin" />
                            : <ShieldCheck size={15} />}
                        </button>

                        {/* Security */}
                        <button
                          onClick={() => { setModifyingUser(user); setForcePasswordChange(user.must_change_password); }}
                          title="Security Settings"
                          className="p-2.5 bg-glass border border-glass-border hover:bg-accent hover:text-white rounded-xl transition-all text-accent"
                        >
                          <Lock size={15} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(user)}
                          title="Edit User"
                          className="p-2.5 bg-glass border border-glass-border hover:bg-primary hover:text-white rounded-xl transition-all text-primary"
                        >
                          <Edit2 size={15} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          title="Remove User"
                          className="p-2.5 bg-glass border border-glass-border hover:bg-accent hover:text-white rounded-xl transition-all text-text-muted hover:text-white"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Card List */}
        <div className="md:hidden p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted animate-pulse">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-40">No users found.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-glass/50 border border-glass-border rounded-2xl p-5 space-y-4">
                {/* Identity Row */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg shrink-0">
                    {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-text-primary tracking-tight text-base truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-[9px] font-bold text-text-muted truncate">{user.email}</p>
                  </div>
                </div>

                {/* Role & Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 border px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${ROLE_COLORS[user.role] || 'text-text-muted border-glass-border bg-glass'}`}>
                    {user.role?.replace(/_/g, ' ')}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 border px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${user.is_active !== false ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 'text-accent border-accent/20 bg-accent/10'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.is_active !== false ? 'bg-emerald-500 animate-pulse' : 'bg-accent'}`} />
                    {user.is_active !== false ? 'Active' : 'Suspended'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 border px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${user.is_verified ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-amber-400 border-amber-400/30 bg-amber-400/10'}`}>
                    <ShieldCheck className="w-3 h-3" />
                    {user.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-glass-border">
                  <div className="flex gap-2">
                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(user)}
                      disabled={togglingId === `active-${user.id}`}
                      title={user.is_active !== false ? 'Suspend' : 'Activate'}
                      className={`p-3 bg-glass border border-glass-border rounded-xl transition-all ${user.is_active !== false ? 'text-text-muted hover:text-accent' : 'text-accent'}`}
                    >
                      {togglingId === `active-${user.id}` ? <Loader2 size={14} className="animate-spin" /> : user.is_active !== false ? <UserMinus size={14} /> : <Unlock size={14} />}
                    </button>
                    {/* Toggle Verified */}
                    <button
                      onClick={() => handleToggleVerified(user)}
                      disabled={togglingId === `verified-${user.id}`}
                      title={user.is_verified ? 'Revoke Verification' : 'Verify'}
                      className={`p-3 bg-glass border border-glass-border rounded-xl transition-all ${user.is_verified ? 'text-emerald-500' : 'text-text-muted hover:text-emerald-500'}`}
                    >
                      {togglingId === `verified-${user.id}` ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    </button>
                    {/* Security */}
                    <button
                      onClick={() => { setModifyingUser(user); setForcePasswordChange(user.must_change_password); }}
                      className="p-3 bg-glass border border-glass-border rounded-xl text-accent"
                    >
                      <Lock size={14} />
                    </button>
                    {/* Edit */}
                    <button onClick={() => openEditModal(user)} className="p-3 bg-glass border border-glass-border rounded-xl text-primary">
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <button onClick={() => handleDeleteUser(user.id)} className="p-3 bg-glass border border-glass-border rounded-xl text-text-muted hover:text-accent transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] bg-bg-darker/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500 overflow-hidden">
          <div className="relative w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] bg-card-bg border border-glass-border rounded-3xl md:rounded-[64px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            <div className="p-6 md:p-16 flex flex-col md:flex-row h-full overflow-hidden">
              {/* Sidebar */}
              <div className="w-full md:w-72 lg:w-80 space-y-6 md:space-y-12 shrink-0 md:border-r border-glass-border md:pr-10 lg:pr-16 mb-8 md:mb-0">
                <div className="flex items-center md:flex-col gap-6 md:gap-12">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-primary rounded-2xl md:rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-primary/20 shrink-0">
                    {editingUser ? <Edit2 className="w-8 h-8 md:w-10 md:h-10" /> : <UserPlus className="w-8 h-8 md:w-10 md:h-10" />}
                  </div>
                  <div className="flex-1 md:text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-text-primary tracking-tighter uppercase leading-[0.9]">
                      {editingUser ? 'Edit' : 'Add'}<br/>
                      <span className="text-primary">User</span>
                    </h2>
                    <div className="hidden md:block w-16 h-1.5 bg-primary mt-6 rounded-full mx-auto" />
                  </div>
                </div>
                <div className="hidden md:block p-8 bg-glass border border-glass-border rounded-[32px] space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-primary">Access Role</h4>
                  <p className="text-[10px] text-text-secondary font-black uppercase leading-relaxed tracking-tight opacity-70">
                    Assign the appropriate role to define what the user can see and do on the platform.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 md:pl-10 lg:pl-16 overflow-y-auto custom-scrollbar pt-2">
                <form onSubmit={handleCreateUser} className="space-y-8 md:space-y-12 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">First Name</label>
                      <input required className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-text-primary outline-none focus:border-primary transition-all font-black text-lg md:text-xl uppercase" value={newUser.first_name} onChange={(e) => setNewUser({...newUser, first_name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">Last Name</label>
                      <input required className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-text-primary outline-none focus:border-primary transition-all font-black text-lg md:text-xl uppercase" value={newUser.last_name} onChange={(e) => setNewUser({...newUser, last_name: e.target.value})} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">Email Address</label>
                      <input required type="email" className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-text-primary outline-none focus:border-primary transition-all font-black text-lg lowercase" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">User Role</label>
                      <select
                        required
                        className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-text-primary outline-none focus:border-primary transition-all font-black text-sm uppercase appearance-none cursor-pointer"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      >
                        {ROLE_OPTIONS.filter(r => r.value !== 'ALL').map(r => (
                          <option key={r.value} value={r.value} className="bg-bg-darker">{r.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">Password {editingUser && <span className="opacity-50">(leave blank to keep)</span>}</label>
                      <input required={!editingUser} type="password" className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-text-primary outline-none focus:border-primary transition-all font-black tracking-widest text-lg" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                    </div>
                  </div>

                  <div className="mt-8 md:mt-16 pt-8 md:pt-10 border-t border-glass-border flex flex-col sm:flex-row justify-end items-center gap-6">
                    <button type="button" onClick={() => { setIsModalOpen(false); setEditingUser(null); }} className="w-full sm:w-auto btn btn-outline px-8 rounded-xl text-text-muted border-glass-border font-black uppercase tracking-widest text-[9px]">Cancel</button>
                    <button type="submit" disabled={createLoading} className="w-full sm:min-w-[240px] btn btn-primary px-10 rounded-xl md:rounded-2xl shadow-xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px]">
                      {createLoading ? <Loader2 className="animate-spin w-4 h-4" /> : (editingUser ? 'Save Changes' : 'Create User')}
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
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-bg-darker/90 backdrop-blur-2xl" onClick={() => setModifyingUser(null)} />
          <div className="relative w-full max-w-lg bg-card-bg border border-glass-border rounded-[32px] md:rounded-[48px] p-8 md:p-12 shadow-2xl overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />
            <div className="space-y-4 mb-10">
              <h3 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-tighter leading-none">Account <span className="text-accent">Security</span></h3>
              <p className="text-text-muted text-[9px] font-black tracking-widest truncate normal-case">{modifyingUser.email}</p>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">Login Settings</label>
                <button onClick={() => setForcePasswordChange(!forcePasswordChange)} className={`w-full p-4 md:p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${forcePasswordChange ? 'bg-accent/10 border-accent/50 text-accent' : 'bg-glass border-glass-border text-text-muted'}`}>
                  <span className="font-black uppercase tracking-widest text-[9px]">Mandatory Password Reset</span>
                  <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${forcePasswordChange ? 'bg-accent' : 'bg-glass-border'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${forcePasswordChange ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">New Password</label>
                <div className="relative">
                  <input type="password" placeholder="NEW PASSWORD" className="w-full bg-glass border border-glass-border rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-text-primary outline-none focus:border-accent transition-all font-black text-sm tracking-widest" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <button type="button" onClick={() => setNewPassword(Math.random().toString(36).slice(-8).toUpperCase())} className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-accent uppercase tracking-widest bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10">Gen</button>
                </div>
              </div>
              <div className="pt-6 flex flex-col gap-4">
                <button onClick={() => handleUpdateUserSecurity(modifyingUser.id)} className="w-full btn btn-primary py-5 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] bg-accent border-none">Update Security</button>
                <button onClick={() => { setModifyingUser(null); setNewPassword(''); }} className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-text-muted">Discard</button>
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
