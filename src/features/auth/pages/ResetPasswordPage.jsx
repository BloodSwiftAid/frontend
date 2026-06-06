import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2, ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';
import { authApi } from '../../../services/api';
import logo from '../../../assets/logo.png';
import toast from 'react-hot-toast';

const ResetPasswordPage = ({ theme }) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlOtp = searchParams.get('otp');
    if (urlEmail) setEmail(urlEmail);
    if (urlOtp) setOtp(urlOtp);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!email || !otp) {
      setError('Email and Authorization Code are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authApi.verifyOTP({ 
        email, 
        otp, 
        new_password: newPassword 
      });
      
      toast.success("Password reset successfully. You can now log in.");
      navigate('/login');
    } catch (err) {
      console.error('Password reset error:', err);
      let msg = 'Failed to reset password. Please check your network connection.';
      
      if (err.response?.data) {
        const data = err.response.data;
        msg = data.message || data.detail || data.error || (typeof data === 'string' ? data : msg);
        if (msg === 'Failed to reset password. Please check your network connection.' && typeof data === 'object') {
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
            <h1 className="text-4xl font-black text-text-primary tracking-tight mb-3 uppercase">Reset Password</h1>
            <p className="text-text-secondary text-lg">Enter your new password to restore access</p>
          </div>

          {error && (
            <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-2xl mb-8 flex items-center gap-3 animate-shake">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/50 transition-all opacity-70"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!!searchParams.get('email')}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Authorization Code</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                  <Key className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/50 transition-all uppercase tracking-widest font-mono"
                  placeholder="XXXXXX"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.toUpperCase())}
                  maxLength={6}
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
              className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 group relative overflow-hidden mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" size={24} />
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-bold tracking-tight uppercase">Update Password</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-8">
            Remembered your password? <Link to="/login" className="text-accent font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
