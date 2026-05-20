import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Shield, 
  Trash2, 
  Edit2, 
  Lock, 
  Key,
  Loader2,
  ArrowRight,
  ShieldCheck,
  UserMinus,
  Unlock
} from 'lucide-react';
import { usersApi } from '../../api';
import { useIsVerified } from '../../hooks/useIsVerified';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

const HospitalUserManagement = () => {
  const isVerified = useIsVerified();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getStaff();
      const userData = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setUsers(userData);
    } catch (error) {
      toast.error('Failed to load staff directory');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error('Verification required for staff management');
      return;
    }
    setLoading(true);
    try {
      if (editingUser) {
        const { password, ...updateData } = newUser;
        const payload = password ? newUser : updateData;
        await usersApi.updateStaff(editingUser.id, payload);
        toast.success('User updated successfully');
      } else {
        await usersApi.createStaff(newUser);
        toast.success('New user added successfully');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setNewUser({ username: '', email: '', first_name: '', last_name: '', password: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!isVerified) return;
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await usersApi.deleteStaff(id);
      toast.success('User access revoked');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  const handleToggleStatus = async (user) => {
    if (!isVerified) return;
    try {
      await usersApi.toggleStaffActive(user.id);
      toast.success(user.is_active ? 'Account suspended' : 'Account restored');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update account status');
    }
  };

  const handleToggleVerification = async (user) => {
    if (!isVerified) return;
    try {
      await usersApi.toggleStaffVerified(user.id);
      toast.success(user.is_verified ? 'Verification revoked' : 'Staff verified');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const openEditModal = (user) => {
    if (!isVerified) return;
    setEditingUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: ''
    });
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">Staff <span className="text-gradient">Directory</span></h1>
          <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] opacity-70">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Authorized Hospital Staff
          </p>
        </div>
        <button 
          onClick={() => { if (!isVerified) return; setEditingUser(null); setNewUser({ username: '', email: '', first_name: '', last_name: '', password: '' }); setIsModalOpen(true); }}
          disabled={!isVerified}
          className={`btn btn-primary px-8 py-4 rounded-2xl shadow-xl gap-3 group transition-all ${!isVerified ? 'opacity-40 grayscale cursor-not-allowed shadow-none' : 'shadow-accent/20'}`}
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold tracking-tight uppercase tracking-widest text-[11px]">Add User</span>
        </button>
      </header>

      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Staff Directory</h2>
            <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest">Manage hospital staff access levels</p>
          </div>
          
          <div className="flex-1 lg:w-96 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold" 
              placeholder="Search staff members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden border border-glass-border rounded-[32px] bg-glass/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-glass/50 border-b border-glass-border">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-accent/5 transition-all group/row">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-glass-border group-hover/row:scale-105 transition-all shadow-sm">
                        <span className="text-xl font-black text-text-primary">{user.username?.[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-lg font-black text-text-primary tracking-tighter uppercase">{user.first_name} {user.last_name}</p>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-text-muted mt-1 opacity-60">
                          <Mail className="w-3 h-3 text-primary" />
                          <span className="lowercase">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">
                        {user.role?.replace(/_/g, ' ') || 'Staff'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-glass-border'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${user.is_active ? 'text-emerald-500' : 'text-text-muted'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button 
                        onClick={() => handleToggleVerification(user)}
                        title={user.is_verified ? 'Revoke Verification' : 'Verify Personnel'}
                        className={`p-3.5 bg-glass border border-glass-border rounded-xl transition-all ${user.is_verified ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-text-muted hover:text-emerald-500'}`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user)}
                        title={user.is_active ? 'Suspend Account' : 'Restore Account'}
                        className={`p-3.5 bg-glass border border-glass-border rounded-xl transition-all ${user.is_active ? 'text-text-muted hover:text-accent' : 'text-accent hover:bg-accent/10'}`}
                      >
                        {user.is_active ? <UserMinus className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => openEditModal(user)}
                        disabled={!isVerified}
                        className={`p-3.5 bg-glass border border-glass-border rounded-xl transition-all text-primary ${!isVerified ? 'opacity-20 cursor-not-allowed' : 'hover:bg-primary/10'}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={!isVerified}
                        className={`p-3.5 bg-glass border border-glass-border rounded-xl transition-all text-accent ${!isVerified ? 'opacity-20 cursor-not-allowed' : 'hover:bg-accent/10'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] bg-bg-darker/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="relative w-full max-w-4xl bg-card-bg border border-glass-border rounded-[56px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
            <form onSubmit={handleCreateUser} className="p-16 space-y-12">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase">{editingUser ? 'Update User' : 'Add New User'}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mt-2">Hospital Staff Management</p>
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  {editingUser ? <Edit2 className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Username</label>
                  <input 
                    className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">First Name</label>
                  <input 
                    className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black uppercase"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Last Name</label>
                  <input 
                    className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black uppercase"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Email Address</label>
                  <input 
                    className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black lowercase"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                {!editingUser && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Initial Password</label>
                    <input 
                      className="w-full bg-glass border border-glass-border rounded-[20px] px-8 py-5 text-text-primary outline-none focus:border-primary transition-all font-black"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-glass-border flex justify-end items-center gap-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary px-12 py-5 rounded-2xl flex items-center gap-6 group"
                >
                  {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                    <>
                      <span className="font-black uppercase tracking-[0.3em] text-[10px]">{editingUser ? 'Update User' : 'Add User'}</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
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

export default HospitalUserManagement;
