import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Loader2, ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';
import { authApi } from '../../api';
import logo from '../../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.login({ username: email, password });
      localStorage.setItem('token', data.access);
      localStorage.setItem('role', data.role);
      localStorage.setItem('facility_verified', data.facility_verified);
      
      if (data.must_change_password) {
        navigate('/setup-password');
        return;
      }

      const role = data.role;
      if (role === 'INTERNAL_ADMIN') navigate('/admin');
      else if (role?.includes('HOSPITAL')) navigate('/hospital');
      else if (role?.includes('BLOODBANK')) navigate('/bloodbank');
      else navigate('/marketplace');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || err.response?.data?.error || 'Invalid credentials. Please verify your login details';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="w-full max-w-[480px] relative z-10 animate-fade-in">
        <div className="bg-card-bg/60 backdrop-blur-3xl border border-glass-border rounded-[40px] p-10 md:p-14 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-12">
            <Link to="/" className="bg-glass p-4 rounded-3xl mb-8 animate-float border border-glass-border hover:scale-105 transition-all shadow-xl group">
              <img src={logo} alt="SwiftAid" className="h-10 w-auto" />
            </Link>
            <h1 className="text-4xl font-black text-text-primary tracking-tight mb-3">Welcome Back</h1>
            <p className="text-text-secondary text-lg">Login to your account</p>
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
                  className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/50 focus:bg-accent/5 transition-all placeholder:text-text-muted"
                  placeholder="admin@swiftaid.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                  <Key className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/50 focus:bg-accent/5 transition-all placeholder:text-text-muted"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-bold tracking-tight uppercase">Login</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-glass-border">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-text-muted">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                L3 Security
              </span>
              <span>v2.0.4-stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
