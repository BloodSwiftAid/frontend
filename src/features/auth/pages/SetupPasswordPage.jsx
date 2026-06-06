import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { authApi } from '../../../services/api';
import logo from '../../../assets/logo.png';

const SetupPasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.changePassword({ 
        old_password: oldPassword, 
        new_password: newPassword 
      });
      
      // Sync the updated verification status to localStorage immediately
      // so the UI unlocks without requiring re-login
      if (res.data?.facility_verified !== undefined) {
        localStorage.setItem('facility_verified', String(res.data.facility_verified));
        // Notify other tabs/components listening to storage events
        window.dispatchEvent(new Event('storage'));
      }
      
      // After success, redirect based on role
      const role = localStorage.getItem('role');
      if (role === 'INTERNAL_ADMIN') navigate('/admin');
      else if (role?.includes('HOSPITAL')) navigate('/hospital');
      else if (role?.includes('BLOODBANK')) navigate('/bloodbank');
      else navigate('/marketplace');
    } catch (err) {
      console.error('Password change error:', err);
      let msg = 'Failed to update password. Please check your network connection.';
      
      if (err.response?.data) {
        const data = err.response.data;
        msg = data.message || data.detail || data.error || (typeof data === 'string' ? data : msg);
        
        // If data is a dictionary but no known keys, flatten it
        if (msg === 'Failed to update password. Please check your network connection.' && typeof data === 'object') {
          msg = Object.values(data).flat().join(', ');
        }
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[520px] relative z-10 animate-fade-in">
        <div className="bg-card-bg/60 backdrop-blur-3xl border border-glass-border rounded-[40px] p-10 md:p-14 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="bg-glass p-4 rounded-3xl mb-8 border border-glass-border">
              <img src={logo} alt="SwiftAid" className="h-10 w-auto" />
            </div>
            <h1 className="text-4xl font-black text-text-primary tracking-tight mb-3 uppercase">Set Password</h1>
            <p className="text-text-secondary text-lg">Update your account password</p>
          </div>

          {error && (
            <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-2xl mb-8 flex items-center gap-3 animate-shake">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Current Password (Temporary)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                  <Key className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/50 transition-all"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/50 transition-all"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/50 transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 group relative overflow-hidden"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-bold tracking-tight uppercase">Update Password</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupPasswordPage;
