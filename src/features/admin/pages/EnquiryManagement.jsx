import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { 
  ClipboardList, 
  Search, 
  ShieldCheck, 
  User, 
  Activity, 
  ShieldAlert, 
  Zap, 
  ChevronRight, 
  X, 
  ArrowLeft, 
  Loader2, 
  Filter, 
  Mail, 
  Phone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Building2, 
  Clock, 
  FileText
} from 'lucide-react';
import LocationSelector from '../../../features/shared/components/LocationSelector';

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'All Enquiries' },
  { value: 'hospital', label: 'Medical Facility' },
  { value: 'bloodbank', label: 'Blood Bank' },
  { value: 'donor', label: 'Blood Donor' },
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'onboarded', label: 'Onboarded' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_COLORS = {
  pending: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  contacted: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  onboarded: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  rejected: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
};

const TYPE_LABELS = {
  hospital: 'Medical Facility',
  bloodbank: 'Blood Bank',
  donor: 'Blood Donor',
};

const EnquiryManagement = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');

  // Selected Enquiry Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Onboarding Wizard State (Prefilled from Enquiry)
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '', address: '', state: '', area: '', hospital_type: 'General', has_emergency_unit: false, country: '', city: '', contact_name: '', contact_email: '', contact_phone: '',
    license_number: '', storage_capacity_liters: 0, commission_percentage: 10.0, logistics_status: ''
  });
  const [newAdmin, setNewAdmin] = useState({
    email: '', password: '', first_name: '', last_name: '', role: ''
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await adminApi.listEnquiries();
      const data = response.data.results || response.data;
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load enquiries.';
      setError(msg);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, statusVal) => {
    try {
      const isResolved = statusVal === 'onboarded' || statusVal === 'rejected';
      await adminApi.updateEnquiry(id, { status: statusVal, is_resolved: isResolved });
      toast.success(`Enquiry status updated to ${statusVal}.`);
      fetchEnquiries();
      
      // Update currently open selected enquiry details
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(prev => ({ ...prev, status: statusVal, is_resolved: isResolved }));
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry record? This cannot be undone.')) return;
    try {
      await adminApi.deleteEnquiry(id);
      toast.success('Enquiry record deleted.');
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to delete enquiry.');
    }
  };

  // Pre-fills and opens Onboarding Wizard Modal
  const handleOpenOnboardWizard = (enquiry) => {
    const payload = enquiry.payload || {};
    
    // Determine names
    const names = (payload.admin_name || enquiry.name || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    // Standardize common fields
    const stateVal = payload.state || '';
    const areaVal = payload.lga || payload.area || '';
    const addressVal = payload.operational_address || payload.address || '';
    const emailVal = payload.admin_email || enquiry.email || '';
    const phoneVal = payload.admin_phone || enquiry.phone || '';

    setNewOrg({
      name: payload.facility_name || enquiry.name || '',
      address: addressVal,
      state: stateVal,
      area: areaVal,
      hospital_type: payload.hospital_type || 'General',
      has_emergency_unit: payload.has_emergency_unit === 'true' || payload.has_emergency_unit === true,
      country: payload.country || 'Nigeria',
      city: payload.city || '',
      contact_name: payload.admin_name || enquiry.name || '',
      contact_email: emailVal,
      contact_phone: phoneVal,
      license_number: payload.license_number || '',
      storage_capacity_liters: 0,
      commission_percentage: 10.0,
      logistics_status: payload.logistics_status || ''
    });

    setNewAdmin({
      email: emailVal,
      password: Math.random().toString(36).slice(-10).toUpperCase(), // Generate random temporary password
      first_name: firstName,
      last_name: lastName,
      role: enquiry.enquiry_type === 'hospital' ? 'HOSPITAL_ADMIN' : 'BLOODBANK_ADMIN'
    });

    setCurrentStep(1);
    setIsOnboardOpen(true);
  };

  // Submits the pre-filled onboarding form
  const handleOnboardSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const isHospital = selectedEnquiry.enquiry_type === 'hospital';

    if (isHospital) {
      if (!newOrg.name || !newOrg.state || !newOrg.area || !newOrg.country || !newOrg.address) {
        toast.error('All facility fields (Name, State, LGA, Country, Address) are required.');
        return;
      }
    } else {
      if (!newOrg.name || !newOrg.license_number || !newOrg.state || !newOrg.area || !newOrg.country || !newOrg.address) {
        toast.error('All facility fields (Name, License, State, LGA, Country, Address) are required.');
        return;
      }
    }

    if (!newAdmin.email || !newAdmin.first_name || !newAdmin.last_name || !newAdmin.password) {
      toast.error('All administrator fields are required.');
      return;
    }

    setOnboardLoading(true);
    try {
      let orgRes;
      let profilePayload = { user_id: null };

      if (isHospital) {
        orgRes = await adminApi.createHospital(newOrg);
        profilePayload.hospital_id = orgRes.data.id;
      } else {
        orgRes = await adminApi.createBloodBank(newOrg);
        profilePayload.blood_bank_id = orgRes.data.id;
      }

      const userRes = await adminApi.createUser({
        ...newAdmin,
        username: newAdmin.email,
        email: newAdmin.email
      });

      profilePayload.user_id = userRes.data.id;
      await adminApi.createProfile(profilePayload);

      // Auto update enquiry status
      await adminApi.updateEnquiry(selectedEnquiry.id, { status: 'onboarded', is_resolved: true });

      toast.success(`${isHospital ? 'Hospital' : 'Blood Bank'} and Administrator successfully registered!`);
      setIsOnboardOpen(false);
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Onboarding registration failed.');
    } finally {
      setOnboardLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEnquiry || isOnboardOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedEnquiry, isOnboardOpen]);

  // Filtering
  const filteredEnquiries = enquiries
    .filter(e => typeFilter === 'ALL' || e.enquiry_type === typeFilter)
    .filter(e => statusFilter === 'ALL' || e.status === statusFilter)
    .filter(e =>
      e?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Status Metrics
  const totalCount = enquiries.length;
  const pendingCount = enquiries.filter(e => e.status === 'pending').length;
  const contactedCount = enquiries.filter(e => e.status === 'contacted').length;
  const onboardedCount = enquiries.filter(e => e.status === 'onboarded').length;
  const rejectedCount = enquiries.filter(e => e.status === 'rejected').length;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12 animate-fade-in relative z-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-glass border border-glass-border rounded-2xl hover:text-accent transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
              Platform <span className="text-primary">Enquiries</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
              <ClipboardList className="w-3.5 h-3.5 text-primary" />
              Registration & Contact Requests
            </p>
          </div>
        </div>
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

      {/* Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
        {[
          { label: 'Total Enquiries', value: totalCount, icon: ClipboardList, color: 'text-primary' },
          { label: 'Pending Review', value: pendingCount, icon: Clock, color: 'text-amber-500' },
          { label: 'Contacted', value: contactedCount, icon: Phone, color: 'text-blue-400' },
          { label: 'Onboarded', value: onboardedCount, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Rejected', value: rejectedCount, icon: X, color: 'text-rose-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border p-6 rounded-3xl shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-glass border border-glass-border flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">{stat.label}</p>
            <h4 className="text-xl md:text-2xl font-black text-text-primary tracking-tighter tabular-nums">{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Search */}
        <div className="flex-1 flex items-center gap-4 bg-card-bg/40 backdrop-blur-2xl border border-glass-border px-6 py-4 md:px-10 md:py-6 rounded-2xl md:rounded-3xl shadow-inner">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input 
            type="text" 
            placeholder="Search enquiries by name, email, or phone..." 
            className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-muted/40 font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter Type */}
        <div className="relative">
          <div className="flex items-center gap-3 bg-card-bg/40 backdrop-blur-2xl border border-glass-border px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl shadow-inner cursor-pointer">
            <Filter className="w-4 h-4 text-primary shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-text-primary font-black text-[10px] uppercase tracking-widest cursor-pointer appearance-none pr-6"
            >
              {TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-bg-darker text-text-primary">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Status */}
        <div className="relative">
          <div className="flex items-center gap-3 bg-card-bg/40 backdrop-blur-2xl border border-glass-border px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl shadow-inner cursor-pointer">
            <Activity className="w-4 h-4 text-accent shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-text-primary font-black text-[10px] uppercase tracking-widest cursor-pointer appearance-none pr-6"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-bg-darker text-text-primary">
                  {opt.label}
                </option>
              ))}
            </select>
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
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Applicant Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Submitted Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted animate-pulse">Loading enquiries...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-40">No enquiries found.</p>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => {
                  const createdDate = new Date(enquiry.date_created).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  });

                  return (
                    <tr key={enquiry.id} className="hover:bg-primary/5 transition-all group/row cursor-pointer" onClick={() => setSelectedEnquiry(enquiry)}>
                      {/* Name & Contact */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/row:scale-105 transition-all shrink-0">
                            <span className="text-base font-black text-primary">
                              {enquiry.name[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-black text-text-primary tracking-tight">
                              {enquiry.name}
                            </p>
                            <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-text-muted mt-1">
                              <span className="flex items-center gap-1 normal-case"><Mail className="w-3 h-3 text-primary/60" />{enquiry.email}</span>
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-primary/60" />{enquiry.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest
                          ${enquiry.enquiry_type === 'hospital' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
                            enquiry.enquiry_type === 'bloodbank' ? 'text-rose-400 border-rose-400/30 bg-rose-400/10' :
                            'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'}`}>
                          {TYPE_LABELS[enquiry.enquiry_type] || enquiry.enquiry_type}
                        </span>
                      </td>

                      {/* Submitted Date */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-xs font-black text-text-secondary uppercase tracking-tighter">
                          <Clock className="w-3.5 h-3.5 text-text-muted" />
                          {createdDate}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-2 border px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${STATUS_COLORS[enquiry.status] || STATUS_COLORS.pending}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          {enquiry.status || 'Pending'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end items-center gap-2">
                          {/* Quick Onboard */}
                          {enquiry.status !== 'onboarded' && (enquiry.enquiry_type === 'hospital' || enquiry.enquiry_type === 'bloodbank') && (
                            <button
                              onClick={() => { setSelectedEnquiry(enquiry); handleOpenOnboardWizard(enquiry); }}
                              title="Onboard Facility"
                              className="p-2.5 bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white rounded-xl transition-all text-primary"
                            >
                              <Plus size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            title="View Details"
                            className="p-2.5 bg-glass border border-glass-border hover:bg-accent hover:text-white rounded-xl transition-all text-accent"
                          >
                            <FileText size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteEnquiry(enquiry.id)}
                            title="Delete Enquiry"
                            className="p-2.5 bg-glass border border-glass-border hover:bg-accent hover:text-white rounded-xl transition-all text-text-muted hover:text-white"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted animate-pulse">Loading enquiries...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-40">No enquiries found.</p>
            </div>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-glass/50 border border-glass-border rounded-2xl p-5 space-y-4 cursor-pointer" onClick={() => setSelectedEnquiry(enquiry)}>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest
                    ${enquiry.enquiry_type === 'hospital' ? 'text-blue-400 border-blue-400/20 bg-blue-400/10' :
                      enquiry.enquiry_type === 'bloodbank' ? 'text-rose-400 border-rose-400/20 bg-rose-400/10' :
                      'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'}`}>
                    {TYPE_LABELS[enquiry.enquiry_type] || enquiry.enquiry_type}
                  </span>
                  <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${STATUS_COLORS[enquiry.status] || STATUS_COLORS.pending}`}>
                    {enquiry.status || 'Pending'}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-black text-text-primary tracking-tight text-base">{enquiry.name}</h4>
                  <p className="text-[9px] font-bold text-text-muted flex items-center gap-1 mt-0.5 normal-case"><Mail className="w-2.5 h-2.5" />{enquiry.email}</p>
                  <p className="text-[9px] font-bold text-text-muted flex items-center gap-1 mt-0.5"><Phone className="w-2.5 h-2.5" />{enquiry.phone}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-glass-border" onClick={e => e.stopPropagation()}>
                  <span className="text-[8px] font-black text-text-muted uppercase tracking-wider">
                    {new Date(enquiry.date_created).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    {enquiry.status !== 'onboarded' && (enquiry.enquiry_type === 'hospital' || enquiry.enquiry_type === 'bloodbank') && (
                      <button onClick={() => { setSelectedEnquiry(enquiry); handleOpenOnboardWizard(enquiry); }} className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
                        <Plus size={13} />
                      </button>
                    )}
                    <button onClick={() => setSelectedEnquiry(enquiry)} className="p-2 bg-glass border border-glass-border rounded-lg text-accent">
                      <FileText size={13} />
                    </button>
                    <button onClick={() => handleDeleteEnquiry(enquiry.id)} className="p-2 bg-glass border border-glass-border rounded-lg text-text-muted hover:text-accent">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && !isOnboardOpen && createPortal(
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-bg-darker/90 backdrop-blur-2xl" onClick={() => setSelectedEnquiry(null)} />
          
          <div className="relative w-full max-w-2xl bg-card-bg border border-glass-border rounded-3xl md:rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent" />
            
            {/* Modal Header */}
            <div className="p-8 border-b border-glass-border flex justify-between items-start">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/5 border border-primary/20 rounded-xl text-[9px] font-black text-primary uppercase tracking-widest mb-3">
                  {TYPE_LABELS[selectedEnquiry.enquiry_type] || selectedEnquiry.enquiry_type}
                </span>
                <h3 className="text-3xl font-black text-text-primary uppercase tracking-tighter">{selectedEnquiry.name}</h3>
                <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1">
                  Submitted: {new Date(selectedEnquiry.date_created).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-3 bg-glass border border-glass-border rounded-xl text-text-muted hover:text-accent transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              {/* Basic Contact Info */}
              <div className="grid grid-cols-2 gap-6 bg-glass/20 border border-glass-border/50 p-6 rounded-2xl">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted">Email address</label>
                  <p className="text-sm font-bold text-text-primary select-all">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted">Mobile phone</label>
                  <p className="text-sm font-bold text-text-primary select-all">{selectedEnquiry.phone}</p>
                </div>
              </div>

              {/* Parsed Payload Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-glass-border pb-2">Enquiry Metadata</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEnquiry.payload && Object.entries(selectedEnquiry.payload).map(([key, val]) => {
                    if (key === 'csrfmiddlewaretoken' || key === 'enquiry_type') return null;
                    const cleanedKey = key.replace(/_/g, ' ').toUpperCase();
                    let stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                    if (stringVal === 'true') stringVal = 'YES';
                    if (stringVal === 'false') stringVal = 'NO';

                    return (
                      <div key={key} className="space-y-1 bg-glass/5 p-4 rounded-xl border border-glass-border/30">
                        <label className="text-[8px] font-black uppercase tracking-widest text-text-muted">{cleanedKey}</label>
                        <p className="text-xs font-black text-text-primary uppercase tracking-tight">{stringVal}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="p-6 bg-glass border border-glass-border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h4 className="text-[10px] font-black text-text-primary uppercase tracking-widest mb-1">Enquiry Workflow</h4>
                  <p className="text-[9px] text-text-muted uppercase font-black opacity-60">Manage registration request stage</p>
                </div>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.filter(o => o.value !== 'ALL').map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, opt.value)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                        ${selectedEnquiry.status === opt.value
                          ? 'bg-accent border-accent text-white shadow-xl shadow-accent/20' 
                          : 'bg-glass border-glass-border text-text-secondary hover:border-accent/30'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-glass-border bg-glass/10 backdrop-blur-sm flex justify-between gap-4">
              <button 
                onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                className="btn btn-outline px-6 py-3 border-accent/20 hover:bg-accent/5 hover:border-accent/50 text-accent rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete Enquiry
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-6 py-3 bg-glass border border-glass-border rounded-xl text-[9px] font-black uppercase tracking-widest text-text-primary"
                >
                  Close
                </button>
                {selectedEnquiry.status !== 'onboarded' && (selectedEnquiry.enquiry_type === 'hospital' || selectedEnquiry.enquiry_type === 'bloodbank') && (
                  <button 
                    onClick={() => handleOpenOnboardWizard(selectedEnquiry)}
                    className="btn btn-primary px-8 py-3 rounded-xl shadow-xl flex items-center gap-2"
                  >
                    <Plus size={14} /> <span className="text-[9px] font-black uppercase tracking-widest">Onboard Facility</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Integrated Onboarding Modal */}
      {isOnboardOpen && selectedEnquiry && createPortal(
        <div className="fixed inset-0 z-[3000] bg-bg-darker/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-card-bg border border-glass-border rounded-[64px] shadow-2xl flex flex-col overflow-hidden animate-scale-up my-auto">
            <div className="p-16 flex flex-col md:flex-row gap-20">
               {/* Modal Sidebar */}
               <div className="w-80 space-y-12 shrink-0">
                  <div className="w-24 h-24 bg-primary/10 border-2 border-primary/20 rounded-[32px] flex items-center justify-center text-primary shadow-xl">
                    <Building2 size={48} />
                  </div>
                  <h2 className="text-5xl font-black text-text-primary tracking-tighter uppercase leading-[0.9]">
                    Onboard<br />
                    <span className="text-primary">{selectedEnquiry.enquiry_type === 'hospital' ? 'Hospital' : 'Blood Bank'}</span>
                  </h2>
                  <div className="space-y-10">
                     <div className={`flex items-center gap-6 ${currentStep === 1 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="w-12 h-12 rounded-[20px] bg-primary/10 border-2 border-primary text-primary flex items-center justify-center font-black text-xs">01</div>
                        <span className="font-black uppercase tracking-widest text-[10px] text-text-primary">Facility Data</span>
                     </div>
                     <div className={`flex items-center gap-6 ${currentStep === 2 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="w-12 h-12 rounded-[20px] bg-glass border-2 border-glass-border text-text-muted flex items-center justify-center font-black text-xs">02</div>
                        <span className="font-black uppercase tracking-widest text-[10px] text-text-primary">Admin Access</span>
                     </div>
                  </div>
               </div>

               {/* Modal Form */}
               <div className="flex-1 space-y-10">
                  {currentStep === 1 ? (
                    <div className="grid grid-cols-2 gap-8 animate-fade-in">
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Facility Name</label>
                          <input className="portal-input" value={newOrg.name} onChange={e => setNewOrg({...newOrg, name: e.target.value})} />
                       </div>
                       
                       {selectedEnquiry.enquiry_type === 'bloodbank' ? (
                         <>
                           <div className="space-y-2">
                              <label className="label-text">License Number</label>
                              <input className="portal-input" value={newOrg.license_number} onChange={e => setNewOrg({...newOrg, license_number: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="label-text">Storage Capacity (Liters)</label>
                              <input className="portal-input" type="number" value={newOrg.storage_capacity_liters} onChange={e => setNewOrg({...newOrg, storage_capacity_liters: parseFloat(e.target.value) || 0})} />
                           </div>
                         </>
                       ) : (
                         <>
                           <div className="space-y-2">
                              <label className="label-text">Hospital Type</label>
                              <select className="portal-input text-xs" value={newOrg.hospital_type} onChange={e => setNewOrg({...newOrg, hospital_type: e.target.value})}>
                                <option value="General">General Hospital</option>
                                <option value="Private">Private Clinic</option>
                                <option value="Teaching">Teaching / Research</option>
                                <option value="Specialist">Specialist Center</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="label-text">ER Infrastructure</label>
                              <button onClick={() => setNewOrg({...newOrg, has_emergency_unit: !newOrg.has_emergency_unit})} className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${newOrg.has_emergency_unit ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-glass border-glass-border text-text-muted opacity-50'}`}>
                                 <span className="uppercase tracking-widest text-[9px] font-black">ER Integrated</span>
                                 <div className={`w-8 h-4 rounded-full relative transition-all duration-300 ${newOrg.has_emergency_unit ? 'bg-accent' : 'bg-glass-border'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${newOrg.has_emergency_unit ? 'right-0.5' : 'left-0.5'}`} />
                                 </div>
                              </button>
                           </div>
                         </>
                       )}
                       
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Address</label>
                          <input className="portal-input" value={newOrg.address} onChange={e => setNewOrg({...newOrg, address: e.target.value})} />
                       </div>
                       
                       <LocationSelector
                          country={newOrg.country} setCountry={v => setNewOrg(prev => ({...prev, country: v}))}
                          state={newOrg.state} setState={v => setNewOrg(prev => ({...prev, state: v}))}
                          lga={newOrg.area} setLga={v => setNewOrg(prev => ({...prev, area: v}))}
                          city={newOrg.city} setCity={v => setNewOrg(prev => ({...prev, city: v}))}
                       />

                       <div className="space-y-2 col-span-2 pt-4 border-t border-glass-border">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Primary Contact Details</h4>
                       </div>
                       <div className="space-y-2">
                          <label className="label-text">Contact Name</label>
                          <input className="portal-input" value={newOrg.contact_name} onChange={e => setNewOrg({...newOrg, contact_name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="label-text">Emergency Line</label>
                          <input className="portal-input" value={newOrg.contact_phone} onChange={e => setNewOrg({...newOrg, contact_phone: e.target.value})} />
                       </div>
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Official Email</label>
                          <input className="portal-input" type="email" value={newOrg.contact_email} onChange={e => setNewOrg({...newOrg, contact_email: e.target.value})} />
                       </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-8 animate-fade-in">
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Admin Email / Username</label>
                          <input className="portal-input" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="label-text">First Name</label>
                          <input className="portal-input" value={newAdmin.first_name} onChange={e => setNewAdmin({...newAdmin, first_name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="label-text">Last Name</label>
                          <input className="portal-input" value={newAdmin.last_name} onChange={e => setNewAdmin({...newAdmin, last_name: e.target.value})} />
                       </div>
                       <div className="space-y-2 col-span-2">
                          <label className="label-text">Temporary Password</label>
                          <div className="relative">
                            <input className="portal-input font-black tracking-widest" type="text" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
                            <button type="button" onClick={() => setNewAdmin({...newAdmin, password: Math.random().toString(36).slice(-10).toUpperCase()})} className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-accent uppercase tracking-widest bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10">Re-Gen</button>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="pt-12 border-t border-glass-border flex justify-between">
                     <button onClick={() => setIsOnboardOpen(false)} className="px-8 py-4 text-text-muted font-black uppercase text-[10px]">Cancel</button>
                     <div className="flex gap-4">
                        {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-8 py-4 border border-glass-border rounded-2xl text-text-primary font-black uppercase text-[10px]">Back</button>}
                        <button 
                          onClick={currentStep === 1 ? () => { 
                            if(selectedEnquiry.enquiry_type === 'hospital') {
                              if(!newOrg.name || !newOrg.state || !newOrg.area || !newOrg.country || !newOrg.address) { 
                                toast.error('All facility fields (Name, State, LGA, Country, Address) are required.'); 
                              } else { 
                                setCurrentStep(2); 
                              } 
                            } else {
                              if(!newOrg.name || !newOrg.license_number || !newOrg.state || !newOrg.area || !newOrg.country || !newOrg.address) { 
                                toast.error('All facility fields (Name, License, State, LGA, Country, Address) are required.'); 
                              } else { 
                                setCurrentStep(2); 
                              }
                            }
                          } : handleOnboardSubmit}
                          disabled={onboardLoading}
                          className="btn btn-primary px-12 py-5 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px]"
                        >
                           {onboardLoading ? <Loader2 className="animate-spin w-4 h-4" /> : currentStep === 1 ? 'Next Step' : 'Confirm Registration'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default EnquiryManagement;
