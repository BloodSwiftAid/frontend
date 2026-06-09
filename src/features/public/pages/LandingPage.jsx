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
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="relative pt-32 pb-24 overflow-hidden">
    {/* Decorative Gradients */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[0%] right-[-20%] w-[50%] h-[50%] bg-accent/5 blur-[100px] rounded-full" />
    </div>

    <div className="container mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      > 
        <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
          Get verified blood <br />
          <span className="text-gradient">Under 20 Minutes.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-text-secondary leading-relaxed mb-10">
          SwiftAid is Nigeria's trusted coordination platform bridging the gap between hospitals and blood banks when seconds matter most.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/join" className="btn btn-primary px-8 py-4 text-base group">
            Make Enquiry
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/about" className="btn btn-outline px-8 py-4 text-base">
            Our Mission
          </Link>
        </div>
      </motion.div>

      {/* Stats / Trust */}
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-16"
      >
        <div className="glass-card p-8 md:p-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                 <Clock className="w-10 h-10 text-primary mb-4" />
                 <h3 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">20 minutes</h3>
                 <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Response Target</p>
              </div>
              <div className="flex flex-col items-center">
                 <Hospital className="w-10 h-10 text-primary mb-4" />
                 <h3 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">100%</h3>
                 <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Verified Access</p>
              </div>
              <div className="flex flex-col items-center">
                 <Activity className="w-10 h-10 text-primary mb-4" />
                 <h3 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">24/7</h3>
                 <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Active Coordination</p>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const ProblemSection = () => (
  <section className="py-20 relative bg-bg-darker">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-6">
            The <span className="text-gradient">Critical Need</span> in Nigeria
          </h2>
          <p className="text-base text-text-secondary leading-relaxed mb-8">
            Over 70% of blood needed in emergencies is currently unavailable in time. SwiftAid addresses the fragmented systems resulting in dangerous delays.
          </p>
          
          <div className="space-y-4">
             {[
               "Critical delays in treating childbirth complications",
               "Fragmented hematology lab networks",
               "Severe blood shortage in urban and rural clusters"
             ].map((text, i) => (
               <div key={i} className="flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                 <span className="text-base text-text-primary">{text}</span>
               </div>
             ))}
          </div>
        </div>
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="glass-card p-8 md:p-10"
        >
          <Activity className="w-12 h-12 text-accent mb-6" />
          <h3 className="text-2xl font-extrabold text-text-primary mb-4">Always Ready</h3>
          <p className="text-base text-text-secondary leading-relaxed">
            SwiftAid is the coordination layer that connects hospitals to blood banks in real-time. We eliminate the search, so you can focus on the patient.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const SolutionSection = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-6 text-center">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-4">
          Intelligent <span className="text-gradient">Coordination</span>
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          A unified coordination platform that scales with your hospital's needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Database, title: "Real-time Inventory", text: "Direct integration with supply partners for instant visibility into available blood types." },
          { icon: Zap, title: "Automated Matching", text: "Our matching engine identifies the best source and coordinates logistics simultaneously." },
          { icon: ShieldCheck, title: "Safety First", text: "Rigorous verification protocols for every unit of blood fulfilled through our network." },
          { icon: Droplet, title: "Guardian Donation Hub", text: "A tamper-proof ecosystem designed to protect donor data and ensure safe, verified tracking." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4 }}
            className="glass-card p-6 text-left"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <feat.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">{feat.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{feat.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20">
    <div className="container mx-auto px-6 text-center">
      <div className="glass-card p-10 md:p-16 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-6">Ready to Secure Your Supply?</h2>
        <p className="text-lg text-text-secondary max-w-xl mx-auto mb-10">
          Join the network relying on SwiftAid for life-saving coordination.
        </p>
        
        <Link to="/join" className="btn btn-primary px-10 py-4 text-base shadow-lg shadow-primary/20">
          Make Enquiry
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
