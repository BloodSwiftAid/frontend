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
import heroBg from '../assets/hero-bg.png';

const Hero = () => (
  <section className="relative pt-40 pb-32 overflow-hidden">
    {/* Map Background */}
    <div className="absolute top-0 left-0 w-full h-full -z-20 pointer-events-none grayscale">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--color-bg-dark) 0%, var(--color-bg-darker) 100%)', opacity: 0.85 }}></div>
    </div>

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
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">Nigeria's Trusted Platform</span>
        </div>
        
        <h1 className="hero-title font-black text-text-primary mb-8 animate-fade-in">
          Get verified blood <br />
          <span className="text-gradient">Under 20 Minutes.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed mb-12">
          SwiftAid is Nigeria's trusted coordination platform bridging the gap between hospitals and donors when seconds matter most.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/join" className="btn btn-primary px-10 py-5 rounded-2xl text-lg group flex items-center justify-center">
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/about" className="btn btn-outline bg-glass border-glass-border px-10 py-5 rounded-2xl text-lg hover:bg-white/5 transition-all">
            Our Mission
          </Link>
        </div>
      </motion.div>

      {/* Stats / Trust */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-24"
      >
        <div className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-12 rounded-[40px] hover:border-accent/50 transition-all duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                 <Clock className="w-12 h-12 text-accent mb-6" />
                 <h3 className="text-4xl font-black text-text-primary mb-2">20 minutes</h3>
                 <p className="text-text-muted text-sm uppercase tracking-widest font-bold">Response Target</p>
              </div>
              <div className="flex flex-col items-center">
                 <Hospital className="w-12 h-12 text-accent mb-6" />
                 <h3 className="text-4xl font-black text-text-primary mb-2">100%</h3>
                 <p className="text-text-muted text-sm uppercase tracking-widest font-bold">Verified Access</p>
              </div>
              <div className="flex flex-col items-center">
                 <Activity className="w-12 h-12 text-accent mb-6" />
                 <h3 className="text-4xl font-black text-text-primary mb-2">24/7</h3>
                 <p className="text-text-muted text-sm uppercase tracking-widest font-bold">Active Coordination</p>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const ProblemSection = () => (
  <section className="py-32 relative bg-bg-darker">
    <div className="container max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-6">
            The <span className="text-gradient">Critical Need</span> in Nigeria
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-10">
            Over 70% of blood needed in emergencies is currenty unavailable in time. SwiftAid addresses the fragmented systems resulting in dangerous delays.
          </p>
          
          <div className="space-y-6">
             {[
               "Critical delays in treating childbirth complications",
               "Fragmented hematology lab networks",
               "Severe blood shortage in urban and rural clusters"
             ].map((text, i) => (
               <div key={i} className="flex items-start gap-4">
                 <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                 <span className="text-lg text-text-primary">{text}</span>
               </div>
             ))}
          </div>
        </div>
        
        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-12 rounded-[40px] hover:border-accent/50 transition-all duration-500 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full group-hover:bg-accent/20 transition-all duration-500" />
          <Activity className="w-20 h-20 text-accent mb-8 relative z-10" />
          <h3 className="text-3xl font-black text-text-primary mb-6 relative z-10">Always Ready</h3>
          <p className="text-lg text-text-secondary leading-relaxed relative z-10">
            SwiftAid is the coordination layer that connects hospitals to blood banks in real-time. We eliminate the search, so you can focus on the patient.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const SolutionSection = () => (
  <section className="py-32 relative">
    <div className="container max-w-7xl mx-auto px-6 text-center">
      <div className="mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-6">
          Intelligent <span className="text-gradient">Coordination</span>
        </h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          A unified coordination platform that scales with your hospital's needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Database, title: "Real-time Inventory", text: "Direct integration with supply partners for instant visibility into available blood types." },
          { icon: Zap, title: "Automated Matching", text: "Our matching engine identifies the best source and coordinates logistics simultaneously." },
          { icon: ShieldCheck, title: "Safety First", text: "Rigorous verification protocols for every unit of blood fulfilled through our network." },
          { icon: Droplet, title: "Guardian Donation Hub", text: "A tamper-proof ecosystem designed to protect donor data and ensure the safe, verified tracking of every life-saving gift." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-card-bg/40 backdrop-blur-xl border border-glass-border p-10 rounded-[40px] hover:border-accent/50 transition-all duration-500 text-left"
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

const CTASection = () => (
  <section className="py-32">
    <div className="container max-w-7xl mx-auto px-6 text-center">
      <div className="bg-gradient-to-br from-accent/20 to-primary/20 border border-glass-border p-16 md:p-24 rounded-[64px] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight mb-8 relative z-10">Ready to Secure Your Supply?</h2>
        <p className="max-w-xl mx-auto text-lg text-text-secondary mb-12 relative z-10">
          Join the network relying on SwiftAid for life-saving coordination.
        </p>
        
        <Link to="/join" className="btn btn-primary px-12 py-5 rounded-2xl text-lg relative z-10 shadow-2xl shadow-accent/40">
          Join
        </Link>
      </div>
    </div>
  </section>
);

const LandingPage = () => (
  <div className="animate-fade-in">
    <Hero />
    <ProblemSection />
    <SolutionSection />
    <CTASection />
  </div>
);

export default LandingPage;
