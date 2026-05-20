import React from 'react';
import { motion } from 'framer-motion';
import { 
  Droplet, 
  Clock, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Hospital, 
  Database, 
  Zap,
  CheckCircle2,
  TrendingUp,
  Heart,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="relative pt-40 pb-32 overflow-hidden">
    {/* Decorative Gradients */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[0%] right-[-20%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
    </div>

    <div className="container max-w-7xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="inline-flex items-center gap-2 bg-glass border border-glass-border px-4 py-2 rounded-full mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">Nigeria's #1 Coordination Network</span>
        </div>
        
        <h1 className="hero-title font-black text-text-primary mb-8 animate-fade-in">
          Verified blood <br />
          <span className="text-gradient">Under 20 Minutes.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed mb-12">
          The intelligent coordination layer bridging the critical gap between hospitals, donors, and supply partners in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/join" className="btn btn-primary px-10 py-5 rounded-2xl text-lg group">
            Signup
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/about" className="btn btn-outline bg-glass border-glass-border px-10 py-5 rounded-2xl text-lg hover:bg-white/5 transition-all">
            How It Works
          </Link>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700"
      >
        <div className="flex items-center justify-center gap-2 font-black text-text-primary uppercase tracking-widest text-[10px] bg-glass px-4 py-2 rounded-xl border border-glass-border">
          <Globe className="w-3.5 h-3.5 text-accent" /> Global Standards
        </div>
        <div className="flex items-center justify-center gap-2 font-black text-text-primary uppercase tracking-widest text-[10px] bg-glass px-4 py-2 rounded-xl border border-glass-border">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Safe & Verified
        </div>
        <div className="flex items-center justify-center gap-2 font-black text-text-primary uppercase tracking-widest text-[10px] bg-glass px-4 py-2 rounded-xl border border-glass-border">
          <TrendingUp className="w-3.5 h-3.5 text-accent" /> Live Tracking
        </div>
        <div className="flex items-center justify-center gap-2 font-black text-text-primary uppercase tracking-widest text-[10px] bg-glass px-4 py-2 rounded-xl border border-glass-border">
          <Heart className="w-3.5 h-3.5 text-accent" /> Life Centric
        </div>
      </motion.div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-32 bg-bg-darker">
    <div className="container max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-6">Built for <span className="text-gradient">Scale.</span></h2>
        <p className="text-text-secondary max-w-2xl mx-auto">Our infrastructure is designed to handle thousands of requests simultaneously with millisecond latency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Database, title: "Global Inventory", text: "Instant visibility into regional blood stock levels across all partner banks." },
          { icon: Zap, title: "Smart Matching", text: "Automated routing algorithms find the fastest delivery path for urgent needs." },
          { icon: ShieldCheck, title: "Verified Safety", text: "Multi-point verification ensures every unit meets clinical standards." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[40px] hover:border-accent/50 transition-all duration-500"
          >
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-8">
              <feat.icon className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-black text-text-primary mb-4">{feat.title}</h3>
            <p className="text-text-secondary leading-relaxed">{feat.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Impact = () => (
  <section className="py-32 relative">
    <div className="container max-w-7xl mx-auto px-6">
      <div className="bg-card-bg/40 backdrop-blur-3xl border border-glass-border rounded-[64px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 md:p-20">
            <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-8">The <span className="text-gradient">Impact</span> Score</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-glass border border-glass-border rounded-2xl group-hover:bg-accent/10 transition-colors">
                  <Activity className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-text-primary mb-2">98%</h4>
                  <p className="text-text-secondary">Coordination success rate across Lagos and Port Harcourt clusters.</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-glass border border-glass-border rounded-2xl group-hover:bg-accent/10 transition-colors">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-text-primary mb-2">&lt;14m</h4>
                  <p className="text-text-secondary">Average coordination time from request to logistics dispatch.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-glass/30 relative hidden lg:block">
            <div className="absolute inset-0 flex items-center justify-center p-20">
              <div className="w-full h-full bg-accent/20 blur-[80px] rounded-full animate-pulse" />
              <Droplet className="w-32 h-32 text-accent relative z-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const LandingPage = () => (
  <div className="animate-fade-in">
    <Hero />
    <Features />
    <Impact />
    
    <section className="py-32">
      <div className="container max-w-7xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-accent/20 to-primary/20 border border-glass-border p-16 md:p-24 rounded-[64px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight mb-8 relative z-10">Secure Your Facility.</h2>
          <p className="max-w-xl mx-auto text-lg text-text-secondary mb-12 relative z-10">Join the network of top-tier hospitals relying on SwiftAid for critical inventory coordination.</p>
          
          <Link to="/join" className="btn btn-primary px-12 py-5 rounded-2xl text-lg relative z-10 shadow-2xl shadow-accent/40">
            Signup
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default LandingPage;
