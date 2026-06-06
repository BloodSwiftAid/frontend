import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  ShieldCheck, 
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { usersApi } from '../../../services/api';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: ''
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await usersApi.getMe();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await usersApi.updateMe({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone
      });
      setProfile(data);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setSaving(true);
    try {
      await usersApi.updateMe({
        password: passwordData.password
      });
      setPasswordData({ password: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password updated successfully. Setup requirement cleared.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
      <header className="text-center lg:text-left">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">Profile <span className="text-primary">Settings</span></h1>
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mt-3 flex items-center justify-center lg:justify-start gap-2">
          <ShieldCheck size={12} className="text-primary" />
          Security Status: Account Verified
        </p>
      </header>

      {message.text && (
        <div className={`p-5 md:p-6 rounded-2xl md:rounded-[24px] flex items-center gap-4 animate-slide-in border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
            : 'bg-accent/10 border-accent/20 text-accent'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-black uppercase tracking-widest text-[10px] md:text-xs">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Profile Identity Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="relative inline-block mb-6 md:mb-8">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[32px] md:rounded-[44px] bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center font-black text-4xl md:text-5xl text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-black/10" />
                   <span className="relative z-10">{profile.first_name?.[0]}{profile.last_name?.[0]}</span>
                </div>
                <button className="absolute -bottom-2 -right-2 p-3.5 bg-white text-bg-darker rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-95">
                  <Camera size={16} />
                </button>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-text-primary tracking-tighter uppercase leading-none">{profile.first_name} {profile.last_name}</h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mt-3 opacity-60">@{profile.username}</p>
              
              <div className="mt-8 md:mt-12 pt-8 md:pt-10 border-t border-glass-border space-y-6 md:space-y-8">
                 <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                       <ShieldCheck size={14} className="text-primary" />
                       <span className="text-[9px] md:text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Security Clearance</span>
                    </div>
                    <div className="bg-glass/50 border border-glass-border p-5 rounded-2xl text-center group-hover:border-primary/30 transition-all shadow-inner">
                       <span className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tighter block leading-none">
                         {localStorage.getItem('role')?.replace(/_/g, ' ') || 'ACCESS DENIED'}
                       </span>
                    </div>
                 </div>

                 <div className="flex justify-between items-center p-5 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                       <span className="text-[9px] md:text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Live Identity Verification</span>
                    </div>
                    <CheckCircle2 size={16} className="text-primary" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Configurations */}
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          {/* Identity Dashboard */}
          <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[32px] md:rounded-[48px] p-8 md:p-12 shadow-xl">
            <div className="flex items-center gap-5 mb-10 md:mb-12">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <User size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tighter leading-none">Identity Configuration</h3>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1 opacity-60">Personal identification records</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Given Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    className="w-full bg-glass/30 border border-glass-border rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-text-primary outline-none focus:border-primary/40 focus:bg-primary/5 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Surname</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    className="w-full bg-glass/30 border border-glass-border rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-text-primary outline-none focus:border-primary/40 focus:bg-primary/5 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Communication Email</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value.toLowerCase()})}
                    className="w-full bg-glass/30 border border-glass-border rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-text-primary outline-none focus:border-primary/40 focus:bg-primary/5 transition-all lowercase"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type="tel" 
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full bg-glass/30 border border-glass-border rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-text-primary outline-none focus:border-primary/40 focus:bg-primary/5 transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2 pt-6">
                <button 
                  disabled={saving}
                  className="w-full md:w-auto px-10 py-5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-95 transition-all"
                >
                  <Save size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Update</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security Dashboard */}
          <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[32px] md:rounded-[48px] p-8 md:p-12 shadow-xl">
            <div className="flex items-center gap-5 mb-10 md:mb-12">
              <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20">
                <Lock size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tighter leading-none">Update Password</h3>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1 opacity-60">Update authentication credentials</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-2">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input 
                    type="password" 
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                    className="w-full bg-glass/30 border border-glass-border rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-text-primary outline-none focus:border-accent/40 focus:bg-accent/5 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-glass/30 border border-glass-border rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-text-primary outline-none focus:border-accent/40 focus:bg-accent/5 transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2 pt-6">
                <button 
                  disabled={saving || !passwordData.password}
                  className="w-full md:w-auto px-10 py-5 bg-glass border border-accent/30 text-accent rounded-2xl flex items-center justify-center gap-3 group active:scale-95 hover:bg-accent hover:text-white transition-all"
                >
                  <Lock size={18} className="group-hover:rotate-12 transition-transform" />
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
