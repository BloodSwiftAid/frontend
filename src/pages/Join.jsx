import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Droplet, Hospital, ShieldCheck, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import LocationSelector from '../components/LocationSelector';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Join = () => {
  const [activeTab, setActiveTab] = useState('hospital');
  const [loading, setLoading] = useState(false);

  const [locCountry, setLocCountry] = useState('NG');
  const [locState, setLocState] = useState('');
  const [locLga, setLocLga] = useState('');
  const [locCity, setLocCity] = useState('');

  const tabs = [
    { id: 'donor', label: 'Blood Donor', icon: Users, description: "Join Nigeria's fastest growing life-saving community." },
    { id: 'hospital', label: 'Medical Facility', icon: Hospital, description: "Get verified blood to your clinical ward in under 20 minutes." },
    { id: 'bloodbank', label: 'Blood Banks', icon: Droplet, description: "Scale your distribution and inventory as a verified supply partner." }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    data.country = locCountry;
    data.state = locState;
    data.lga = locLga;
    data.city = locCity;
    data.facility_type = activeTab;

    if (activeTab === 'hospital' || activeTab === 'bloodbank') {
      if (!locState || !locLga || !locCountry) {
        toast.error('State, LGA, and Country are required for facility registration.');
        setLoading(false);
        return;
      }
    }

    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      if (activeTab === 'donor') {
        await axios.post(`${baseURL}/auth/register-donor/`, data);
        toast.success('Registration submitted successfully. We will contact you soon!');
      } else {
        await axios.post(`${baseURL}/auth/register-facility/`, data);
        toast.success('Application transmitted successfully. Our coordination team will review your credentials.');
      }
      e.target.reset();
      setLocState(''); setLocLga(''); setLocCity('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch(activeTab) {
      case 'hospital':
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Facility Name</label>
                <input required name="facility_name" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="e.g. St. Nicholas Hospital" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Department</label>
                <select name="hospital_type" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all">
                  <option value="Clinical Procurement" className="bg-card-bg text-text-primary">Clinical Procurement</option>
                  <option value="Administration" className="bg-card-bg text-text-primary">Administration</option>
                  <option value="Emergency Services" className="bg-card-bg text-text-primary">Emergency Services</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2 border-b border-glass-border pb-4 mt-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Admin Contact Details</h4>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Admin Name</label>
                <input required name="admin_name" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="Dr. Adebayo Smith" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Admin / Work Email</label>
                <input required name="admin_email" type="email" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="procurement@facility.ng" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Admin Phone</label>
                <input required name="admin_phone" type="tel" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="+234 ..." />
              </div>
              <div className="space-y-2 md:col-span-2 border-b border-glass-border pb-4 mt-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Facility Location</h4>
              </div>
              <LocationSelector 
                country={locCountry} setCountry={setLocCountry}
                state={locState} setState={setLocState}
                lga={locLga} setLga={setLocLga}
                city={locCity} setCity={setLocCity}
                inputClassName="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Operational Address</label>
              <textarea required name="operational_address" rows="2" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all resize-none placeholder:text-text-muted" placeholder="Enter full physical address" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <><span className="text-lg font-bold">Signup</span> <ChevronRight className="w-5 h-5" /></>}
            </button>
          </div>
        );
      case 'bloodbank':
        return (
          <div className="space-y-10 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Partner Facility Name</label>
                 <input required name="facility_name" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="e.g. Lagos Central Lab" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">License Number</label>
                <input required name="license_number" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="L-00XXX" />
              </div>
              <div className="space-y-2 md:col-span-2 border-b border-glass-border pb-4 mt-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Admin Contact Details</h4>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Admin Name</label>
                <input required name="admin_name" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="Dr. Adebayo Smith" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Admin / Work Email</label>
                <input required name="admin_email" type="email" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="admin@bloodbank.ng" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Admin Phone</label>
                <input required name="admin_phone" type="tel" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="+234 ..." />
              </div>
              <div className="space-y-2 md:col-span-2 border-b border-glass-border pb-4 mt-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Facility Location</h4>
              </div>
              <LocationSelector 
                country={locCountry} setCountry={setLocCountry}
                state={locState} setState={setLocState}
                lga={locLga} setLga={setLocLga}
                city={locCity} setCity={setLocCity}
                inputClassName="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Cold Chain Logistics Status</label>
              <textarea name="logistics_status" rows="3" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all resize-none placeholder:text-text-muted" placeholder="Describe your current storage and delivery capabilities" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Operational Address</label>
              <textarea required name="operational_address" rows="2" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all resize-none placeholder:text-text-muted" placeholder="Enter full physical address" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <><span className="text-lg font-bold">Signup</span> <ChevronRight className="w-5 h-5" /></>}
            </button>
          </div>
        );
      case 'donor':
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Full Name</label>
                <input required name="full_name" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="Adebayo Oluasegun" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Email</label>
                <input required name="email" type="email" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="adebayo@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Blood Group</label>
                <select name="blood_group" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all">
                  <option value="O+" className="bg-card-bg text-text-primary">O Positive (+)</option>
                  <option value="O-" className="bg-card-bg text-text-primary">O Negative (-)</option>
                  <option value="A+" className="bg-card-bg text-text-primary">A Positive (+)</option>
                  <option value="A-" className="bg-card-bg text-text-primary">A Negative (-)</option>
                  <option value="B+" className="bg-card-bg text-text-primary">B Positive (+)</option>
                  <option value="B-" className="bg-card-bg text-text-primary">B Negative (-)</option>
                  <option value="AB+" className="bg-card-bg text-text-primary">AB Positive (+)</option>
                  <option value="AB-" className="bg-card-bg text-text-primary">AB Negative (-)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Mobile Contact (WhatsApp Enabled)</label>
                <input required name="phone" type="tel" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" placeholder="+234 ..." />
              </div>
              <div className="space-y-2 md:col-span-2 border-b border-glass-border pb-4 mt-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Location Details</h4>
              </div>
              <LocationSelector 
                country={locCountry} setCountry={setLocCountry}
                state={locState} setState={setLocState}
                lga={locLga} setLga={setLocLga}
                city={locCity} setCity={setLocCity}
                inputClassName="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Residential Address</label>
              <textarea name="address" rows="2" className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all resize-none placeholder:text-text-muted" placeholder="Enter full address" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <><span className="text-lg font-bold">Signup</span> <ChevronRight className="w-5 h-5" /></>}
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="pt-40 pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left: Content */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter leading-none mb-6">
                Expand the <br />
                <span className="text-gradient">Network.</span>
              </h1>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={activeTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-xl text-text-secondary leading-relaxed"
                >
                  {tabs.find(t => t.id === activeTab).description}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              {[
                "Secure Data Protection",
                "Priority Matching System",
                "Direct Logistics Integration"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-sm font-bold text-text-primary uppercase tracking-widest">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-glass/50 p-8 rounded-[32px] border border-glass-border">
              <div className="flex items-center gap-4 mb-4">
                <ShieldCheck className="w-8 h-8 text-accent" />
                <h4 className="text-lg font-bold text-text-primary">Trust Assurance</h4>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                All partnerships are subject to a 48-hour clinical audit to ensure compliance with SwiftAid's high safety and coordination standards.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="bg-card-bg/60 backdrop-blur-3xl border border-glass-border rounded-[48px] p-8 md:p-14 shadow-2xl relative overflow-hidden">
              {/* Tab Selector */}
              <div className="flex flex-wrap gap-4 mb-14 bg-glass p-2 rounded-3xl border border-glass-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500 font-bold text-sm tracking-tight
                      ${activeTab === tab.id 
                        ? 'bg-accent text-white shadow-xl shadow-accent/20' 
                        : 'text-text-secondary hover:text-accent hover:bg-glass'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {renderForm()}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
