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
import { usersApi } from '../../api';

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
    <div className="p-8 md:p-12 space-y-12 animate-fade-in max-w-5xl mx-auto">
      <header>
        <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase">Profile <span className="text-gradient">Settings</span></h1>
        <p className="text-text-secondary mt-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          Security Status: Account Verified
        </p>
      </header>

      {message.text && (
        <div className={`p-6 rounded-[24px] flex items-center gap-4 animate-slide-in border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
            : 'bg-accent/10 border-accent/20 text-accent'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <span className="font-black uppercase tracking-widest text-xs">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Identity Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] p-10 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-accent to-primary flex items-center justify-center font-black text-4xl text-white shadow-2xl">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-white text-bg-darker rounded-2xl shadow-xl hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-2xl font-black text-text-primary tracking-tighter uppercase">{profile.first_name} {profile.last_name}</h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mt-2">@{profile.username}</p>
              
              <div className="mt-10 pt-8 border-t border-glass-border space-y-6">
                 <div className="space-y-3">
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                       <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Security Clearance</span>
                    </div>
                    <div className="bg-glass border border-glass-border p-4 rounded-2xl text-center group-hover:border-accent/30 transition-all">
                       <span className="text-xl font-black text-text-primary uppercase tracking-tighter block leading-none">
                         {localStorage.getItem('role')?.replace(/_/g, ' ') || 'ACCESS DENIED'}
                       </span>
                    </div>
                 </div>

                 <div className="flex justify-between items-center p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Identity Verified</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Configurations */}
        <div className="lg:col-span-2 space-y-12">
          {/* Identity Matrix */}
          <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-accent/10 rounded-2xl">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">User Details</h3>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Update your profile information</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-14 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-14 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-14 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="tel" 
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-14 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="md:col-span-2 pt-4">
                <button 
                  disabled={saving}
                  className="btn btn-primary w-full md:w-auto px-12 py-5 rounded-2xl shadow-xl shadow-accent/20 flex items-center justify-center gap-3 group"
                >
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-black uppercase tracking-widest text-xs">Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security Matrix */}
          <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border rounded-[48px] p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Lock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Change Password</h3>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Secure your account with a new password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="password" 
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-14 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-14 pr-6 text-text-primary outline-none focus:border-accent/50 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="md:col-span-2 pt-4">
                <button 
                  disabled={saving || !passwordData.password}
                  className="btn btn-outline w-full md:w-auto px-12 py-5 rounded-2xl flex items-center justify-center gap-3 group border-blue-500/30 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Lock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="font-black uppercase tracking-widest text-xs">Change Password</span>
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
