import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message successfully routed to contact@swiftaid.ng. The SwiftAid team will contact you shortly.");
    // In production, use a service like Formspree:
    // e.target.action = `https://formspree.io/f/YOUR_ID_HERE`;
    // e.target.submit();
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '100px' }}>
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '1.5rem' }}>Get in <span className="text-gradient">Touch</span></h1>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
              General inquiries, feedback, or support - we're here to help.
            </p>
          </div>

          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 750px) 350px', gap: '3rem', justifyContent: 'center', alignItems: 'start' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
              style={{ background: 'var(--card-bg)' }}
            >
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>General Inquiry</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600 }}>Full Name</label>
                  <input type="text" placeholder="Your name" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', padding: '0.875rem', borderRadius: '12px', color: 'var(--text-primary)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600 }}>Work Email</label>
                  <input type="email" placeholder="you@company.com" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', padding: '0.875rem', borderRadius: '12px', color: 'var(--text-primary)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600 }}>Subject</label>
                  <input type="text" placeholder="What can we help you with?" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', padding: '0.875rem', borderRadius: '12px', color: 'var(--text-primary)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600 }}>Message</label>
                  <textarea rows="5" placeholder="Your message..." style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', padding: '0.875rem', borderRadius: '12px', color: 'var(--text-primary)', resize: 'vertical' }} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', width: '100%' }}>
                  Send Message <Send size={18} style={{ marginLeft: '8px' }} />
                </button>
              </form>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--glass)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <Mail size={24} color="var(--accent)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Email Us</h4>
                  <p style={{ color: 'var(--text-muted)' }}>contact@swiftaid.ng</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--glass)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <Phone size={24} color="var(--accent)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Call Support</h4>
                  <p style={{ color: 'var(--text-muted)' }}>+234 810 SwiftAid</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--glass)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <MapPin size={24} color="var(--accent)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Our Office</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Lagos Cluster Headquarters<br />Nigeria</p>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--glass)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                 <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1rem' }}>
                    <MessageSquare color="var(--accent)" />
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Community First</h4>
                 </div>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    SwiftAid is more than a platform - it's a mission to eliminate blood shortage in Nigeria. Join us in building a better future.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 768px) {
          .card {
            padding: 1.5rem !important;
          }
          .section {
            padding: 3rem 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
