import React from 'react';
import { 
  Droplet, 
  MapPin, 
  Search, 
  Navigation, 
  Clock, 
  ShieldCheck,
  Filter,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';

const BloodCard = ({ group, type, bank, distance, price }) => (
  <div className="card glass hover:shadow-2xl transition-all duration-500 border-none group overflow-hidden">
    <div className="absolute top-0 right-0 p-4">
      <div className="bg-rose-500/10 text-rose-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
        Available
      </div>
    </div>
    <div className="flex gap-6 items-center">
      <div className="w-24 h-24 bg-rose-500 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl shadow-rose-200 group-hover:rotate-6 transition-transform duration-500">
        <span className="text-3xl font-black">{group}</span>
        <span className="text-[10px] font-bold uppercase opacity-80">{type}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-foreground">{bank}</h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-secondary-foreground/60">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            {distance}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" />
            15-20 min
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-foreground">₦{price}</p>
        <button className="btn btn-primary mt-3 group-hover:px-8 transition-all">
          Order
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary pt-24 pb-48 px-8">
        <div className="max-w-4xl mx-auto text-center text-white space-y-6">
          <h1 className="text-6xl font-black tracking-tight animate-fade-in">Find Blood Near You</h1>
          <p className="text-primary-foreground/80 text-xl animate-fade-in [animation-delay:200ms]">
            Real-time availability tracking across Lagos state. Fast, reliable, life-saving.
          </p>
          
          <div className="relative max-w-2xl mx-auto mt-12 animate-fade-in [animation-delay:400ms]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/40" />
            <input 
              type="text" 
              className="w-full h-18 rounded-3xl bg-white/95 border-none shadow-2xl pl-16 pr-8 text-foreground text-lg focus:ring-4 focus:ring-white/20"
              placeholder="Search blood group (e.g. O+)..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto -mt-24 px-8 pb-24 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex gap-4">
            <div className="card py-3 px-6 glass flex items-center gap-3">
              <Navigation className="w-5 h-5 text-primary" />
              <div>
                <p className="text-[10px] font-bold text-secondary-foreground/50 uppercase">Your Location</p>
                <p className="text-sm font-bold">Ikeja, Lagos</p>
              </div>
            </div>
            <div className="card py-3 px-6 glass flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-[10px] font-bold text-secondary-foreground/50 uppercase">Verified Banks</p>
                <p className="text-sm font-bold">48 Active</p>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary glass font-bold">
            <Filter className="w-4 h-4" />
            Refine Search
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <BloodCard group="O+" type="Whole Blood" bank="Lagos Central Blood Bank" distance="2.4km away" price="8,500" />
          <BloodCard group="A-" type="Plasma" bank="Island Hope Hospital" distance="5.1km away" price="12,000" />
          <BloodCard group="B+" type="Whole Blood" bank="General Medical Center" distance="0.8km away" price="7,800" />
          <BloodCard group="O-" type="Platelets" bank="Red Cross Station" distance="1.2km away" price="15,000" />
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
