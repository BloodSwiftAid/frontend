import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

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
    <div className="page-wrapper pt-24 pb-16">
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Our coordination team is available 24/7 for critical inquiries, partnership opportunities, and technical support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Contact Information Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-1">Email Address</h4>
                    <p className="text-text-primary">info@swiftaid.co</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-1">Voice Support</h4>
                    <p className="text-text-primary">+234 810 SWIFTAID</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-1">Headquarters</h4>
                    <p className="text-text-primary">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Contact Form Card */}
            <div className="lg:col-span-3">
              <div className="glass-card p-8">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-20 h-20 bg-success/10 rounded-2xl flex items-center justify-center text-success mx-auto border border-success/20">
                      <Send className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">Submission Successful</h3>
                      <p className="text-sm text-text-secondary">Your inquiry has been routed to our support coordination team. Response time: &lt; 2 hours.</p>
                    </div>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="btn btn-outline px-6 py-2.5"
                    >
                      New Submission
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="field-label">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Your name" 
                          className="input-field" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="field-label">Work Email</label>
                        <input 
                          type="email" 
                          placeholder="facility@swiftaid.ng" 
                          className="input-field" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="field-label">Subject</label>
                      <input 
                        type="text" 
                        placeholder="Purpose of inquiry" 
                        className="input-field" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="field-label">Message</label>
                      <textarea 
                        rows="5" 
                        placeholder="Detailed inquiry..." 
                        className="input-field resize-none" 
                        required 
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full btn btn-primary py-3 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-5 h-5" />
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
