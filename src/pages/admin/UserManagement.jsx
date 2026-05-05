import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { adminApi } from '../../api';
import { 
  Users, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  UserPlus,
  Mail,
  Tag,
  Trash2,
  Edit2,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  X,
  ArrowLeft,
  ArrowRight,
  Loader2,
  User,
  Lock,
  Key
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      alert('Security protocol updated successfully.');
      setModifyingUser(null);
      setNewPassword('');
      setForcePasswordChange(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update security credentials.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to revoke this identity? This action is irreversible.')) return;
    try {
      await adminApi.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Action failed. Security violation detected.');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      password: '', // Password not required for profile update
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.listUsers();
      const data = response.data.results || response.data;
      // Filter for Internal Admins only
      const admins = Array.isArray(data) ? data.filter(u => u.role === 'INTERNAL_ADMIN') : [];
      setUsers(admins);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      if (editingUser) {
        // Update existing user
        const updateData = { ...newUser };
        if (!updateData.password) delete updateData.password; // Don't send empty password
        await adminApi.updateUser(editingUser.id, updateData);
      } else {
        // Create new user
        await adminApi.createUser({ ...newUser, username: newUser.email });
      }

      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
      setNewUser({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'INTERNAL_ADMIN'
      });
    } catch (error) {
      console.error('Error in identity operation:', error);
      alert(editingUser ? 'Update failed: Security violation.' : 'Security violation: Failed to authorize new administrator.');
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-8 space-y-10 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase tracking-tighter">User <span className="text-accent">Management</span></h1>
          <p className="text-text-secondary mt-2">Oversee internal system administrators and high-level protocol access.</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 gap-3 group"
        >
          <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="font-bold tracking-tight uppercase">Onboard Admin</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-card-bg/40 backdrop-blur-xl border border-glass-border p-4 rounded-2xl focus-within:border-accent/50 transition-all">
          <Search className="w-5 h-5 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by identity, email, or protocol role..." 
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-glass/50 border-b border-glass-border">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Personnel Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Security Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Verification Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Decrypting Registry...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-text-secondary font-bold">No identities found matching the current filter.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-accent/5 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border border-glass-border group-hover:scale-110 transition-transform duration-500">
                          <span className="text-lg font-black text-white">{user.username[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-base font-black text-white group-hover:text-accent transition-colors">{user.first_name} {user.last_name}</p>
                          <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 bg-glass border border-glass-border px-3 py-1.5 rounded-xl">
                        <Tag className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                          {user.role?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {user.is_verified || true ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active Node</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Revoked</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {user.must_change_password && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[9px] font-black uppercase tracking-widest mr-2">
                            <Key className="w-3 h-3" />
                            Setup Required
                          </div>
                        )}
                        <button 
                          onClick={() => { setModifyingUser(user); setForcePasswordChange(user.must_change_password); }}
                          className="p-3 bg-glass hover:bg-amber-500/10 rounded-xl transition-all text-amber-500 border border-glass-border"
                          title="Security Controls"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-3 bg-glass hover:bg-blue-500/10 rounded-xl transition-all text-blue-400 border border-glass-border"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-3 bg-glass hover:bg-accent/10 rounded-xl transition-all text-accent border border-glass-border"
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

      {/* Full-Screen Identity Wizard */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] bg-bg-darker animate-in fade-in duration-500 overflow-hidden flex">
          {/* Identity Sidebar */}
          <div className="w-full md:w-80 lg:w-96 bg-glass border-r border-glass-border p-12 flex flex-col justify-between h-screen hidden md:flex shrink-0">
            <div className="space-y-10">
              <div className="w-16 h-16 bg-accent rounded-[24px] flex items-center justify-center shadow-2xl shadow-accent/40">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Identity<br/><span className="text-accent">Forge</span></h2>
                <div className="w-12 h-1 bg-accent mt-4 rounded-full" />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Authorizing a new personnel node requires precise biological and security credentials.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-accent">
                  <div className="w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center text-xs font-black">1</div>
                  <span className="text-xs uppercase tracking-[0.2em] font-black">Credential Protocol</span>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 p-6 rounded-3xl border border-accent/10">
              <p className="text-[10px] font-black uppercase text-accent tracking-widest mb-2">Security Note</p>
              <p className="text-xs text-text-secondary">Password complexity must meet L3 encryption standards.</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-bg-darker flex flex-col h-screen overflow-hidden">
            <div className="p-10 border-b border-glass-border flex justify-between items-center bg-card-bg/50 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-glass rounded-xl transition-colors text-text-secondary">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                  {editingUser ? `Editing Admin: ${newUser.email}` : 'User Onboard'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-glass hover:bg-accent/10 rounded-xl transition-colors group">
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-5xl mx-auto w-full">
                <form onSubmit={handleCreateUser} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                      <User className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Personnel Profile</h2>
                      <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest opacity-60">Authentication & Legal Parameters</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-accent ml-1">Legal First Name</label>
                      <input 
                        required
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newUser.first_name}
                        onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-accent ml-1">Legal Last Name</label>
                      <input 
                        required
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newUser.last_name}
                        onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Authorized Email</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Security Role</label>
                      <input 
                        disabled
                        className="w-full bg-glass/20 border border-glass-border rounded-xl px-5 py-3.5 text-text-muted outline-none"
                        value="System Administrator"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Security Password</label>
                      <input 
                        required
                        type="password"
                        className="w-full bg-glass border border-glass-border rounded-xl px-5 py-3.5 text-white outline-none focus:border-accent/50 transition-all"
                        placeholder="••••••••"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-10 flex justify-end gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-outline py-4 px-10 rounded-xl text-white border-glass-border bg-glass"
                    >
                      Abort
                    </button>
                    <button 
                      type="submit"
                      disabled={createLoading}
                      className="btn btn-primary py-4 px-14 rounded-xl shadow-2xl shadow-accent/30 flex items-center justify-center gap-3 bg-accent border-none"
                    >
                      {createLoading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        <span className="font-black uppercase tracking-widest text-xs">Setup Identity</span>
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

      {/* User Security Modification Modal */}
      {modifyingUser && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-bg-darker/80 backdrop-blur-md" onClick={() => setModifyingUser(null)} />
          <div className="relative w-full max-w-md bg-card-bg border border-glass-border rounded-[40px] p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
            
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Admin Security</h3>
            <p className="text-text-secondary text-sm mb-8">Updating protocol for <span className="text-white font-bold">{modifyingUser.email}</span></p>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Force Security Reset</label>
                <button 
                  onClick={() => setForcePasswordChange(!forcePasswordChange)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${forcePasswordChange ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-glass border-glass-border text-text-secondary'}`}
                >
                  <span className="font-bold text-xs">Require Setup on Next Login</span>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${forcePasswordChange ? 'bg-amber-500' : 'bg-glass-border'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${forcePasswordChange ? 'left-6' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Emergency Password Override</label>
                <input 
                  type="password"
                  placeholder="Enter new security password"
                  className="w-full bg-glass border border-glass-border rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-500/50 transition-all"
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
                  onClick={() => handleUpdateUserSecurity(modifyingUser.id)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-amber-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Commit Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
