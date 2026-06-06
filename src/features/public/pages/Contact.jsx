import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Globe, Activity, Loader2 } from 'lucide-react';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="page-wrapper pt-32">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
            <h1 className="hero-title font-black text-text-primary uppercase">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Our coordination team is available 24/7 for critical inquiries, partnership opportunities, and technical support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Contact Information Sidebar */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-10">
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-glass border border-glass-border rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">Email Address</h4>
                    <p className="text-xl font-black text-text-primary lowercase tracking-tight">info@swiftaid.co</p>
                  </div>
                </div>
                
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-glass border border-glass-border rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">Voice Support</h4>
                    <p className="text-xl font-black text-text-primary uppercase tracking-tight">+234 810 SWIFTAID</p>
                  </div>
                </div>

                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-glass border border-glass-border rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">Headquarters</h4>
                    <p className="text-xl font-black text-text-primary uppercase tracking-tight">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Contact Form Card */}
            <div className="lg:col-span-7">
              <div className="glass-card p-10 md:p-16 relative overflow-hidden">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 space-y-8"
                  >
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-[40px] flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/30">
                      <Send className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-4">Submission Successful</h3>
                      <p className="text-text-secondary">Your inquiry has been routed to our support coordination team. Response time: &lt; 2 hours.</p>
                    </div>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="btn btn-outline px-10 py-4 rounded-2xl text-xs"
                    >
                      New Submission
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary ml-1">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Your name" 
                          className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" 
                          required 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary ml-1">Work Email</label>
                        <input 
                          type="email" 
                          placeholder="facility@swiftaid.ng" 
                          className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary ml-1">Subject</label>
                      <input 
                        type="text" 
                        placeholder="Purpose of inquiry" 
                        className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all placeholder:text-text-muted" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary ml-1">Message</label>
                      <textarea 
                        rows="5" 
                        placeholder="Detailed inquiry..." 
                        className="w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all resize-none placeholder:text-text-muted" 
                        required 
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full btn btn-primary py-6 rounded-2xl shadow-2xl shadow-accent/40 flex items-center justify-center gap-4 group"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-6 h-6" />
                      ) : (
                        <>
                          <span className="text-lg font-black uppercase tracking-widest">Send Message</span>
                          <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
