import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Heart } from 'lucide-react';
import aboutImg from '../../../assets/about-img.png';

const About = () => {
  return (
    <div className="page-wrapper pt-24 pb-16">
      <section className="section">
        <div className="container">
          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">Our Mission to <span className="text-gradient">Save Lives</span></h1>
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                SwiftAid was founded with a single, urgent goal: to ensure that no patient is ever at risk due to a lack of blood supply. 
                In Nigeria, where 1 in 4 maternal deaths is caused by heavy bleeding, we are building the coordination layer that turns 
                emergency response into a precise science.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
                  <p className="text-sm text-text-muted">Verified Supply</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-primary mb-2">20min</h3>
                  <p className="text-sm text-text-muted">Target Fulfillment</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="glass-card overflow-hidden">
                <img src={aboutImg} alt="Medical Professional" className="w-full" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
                Founded in Nigeria
              </div>
            </motion.div>
          </div>

          {/* Core Pillars Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Our Core Pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6">
              <Shield size={32} className="text-primary mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-3">Unwavering Trust</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We only partner with certified labs and blood banks to ensure every unit is safe and verified.
              </p>
            </div>
            <div className="glass-card p-6">
              <Target size={32} className="text-primary mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-3">Precision Response</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Our intelligence platform matches supply with demand in seconds, even during peak urgency.
              </p>
            </div>
            <div className="glass-card p-6">
              <Users size={32} className="text-primary mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-3">Inclusive Access</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                From small private clinics to large public hospitals, we serve the entire healthcare ecosystem.
              </p>
            </div>
            <div className="glass-card p-6">
              <Heart size={32} className="text-primary mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-3">Patient First</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
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
