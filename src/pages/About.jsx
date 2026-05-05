import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Heart } from 'lucide-react';
import aboutImg from '../assets/about-img.png';

const About = () => {
  return (
    <div className="page-wrapper" style={{ paddingTop: '100px' }}>
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '1.5rem' }}>Our Mission to <span className="text-gradient">Save Lives</span></h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                SwiftAid was founded with a single, urgent goal: to ensure that no patient is ever at risk due to a lack of blood supply. 
                In Nigeria, where 1 in 4 maternal deaths is caused by heavy bleeding, we are building the coordination layer that turns 
                emergency response into a precise science.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '2rem' }}>
                <div>
                  <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>100%</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Verified Supply</p>
                </div>
                <div>
                  <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>20min</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Target Fulfillment</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: 'relative' }}
            >
              <div style={{ 
                borderRadius: '24px', 
                overflow: 'hidden', 
                border: '1px solid var(--glass-border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}>
                <img src={aboutImg} alt="Medical Professional" style={{ width: '100%', display: 'block' }} />
              </div>
              <div style={{ 
                position: 'absolute', 
                bottom: '-20px', 
                right: '-20px', 
                background: 'var(--accent)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '16px',
                fontWeight: 700,
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}>
                Founded in Nigeria
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-darker)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem' }}>Our Core Pillars</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ background: 'var(--card-bg)' }}>
              <Shield size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
              <h3>Unwavering Trust</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                We only partner with certified labs and blood banks to ensure every unit is safe and verified.
              </p>
            </div>
            <div className="card" style={{ background: 'var(--card-bg)' }}>
              <Target size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
              <h3>Precision Response</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Our intelligence platform matches supply with demand in seconds, even during peak urgency.
              </p>
            </div>
            <div className="card" style={{ background: 'var(--card-bg)' }}>
              <Users size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
              <h3>Inclusive Access</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                From small private clinics to large public hospitals, we serve the entire healthcare ecosystem.
              </p>
            </div>
            <div className="card" style={{ background: 'var(--card-bg)' }}>
              <Heart size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
              <h3>Patient First</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Every decision we make is driven by a commitment to the patient waiting at the point of care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
