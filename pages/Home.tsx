
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, Home as HomeIcon, TrendingUp, ShieldCheck, Zap, X } from 'lucide-react';
import { useApp } from '../App';
import PropertyCard from '../components/PropertyCard';
import { getSearchSuggestions } from '../services/geminiService';

export default function Home() {
  const { properties, setCurrentPage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSuggesting(true);
        const res = await getSearchSuggestions(searchQuery);
        setSuggestions(res);
        setIsSuggesting(false);
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const featured = properties.slice(0, 3);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/20" />
        </div>

        <div className="relative z-10 w-full max-w-4xl px-4 text-center text-white space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Find Your <span className="text-indigo-400">Perfect Space</span> Without The Stress
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 font-light max-w-2xl mx-auto">
            Discover thousands of verified rooms, apartments, and villas tailored to your lifestyle.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl transition-all group-focus-within:bg-white/100">
              <div className="flex items-center p-2 bg-white rounded-xl shadow-inner">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  placeholder="Where do you want to live?"
                  className="w-full px-4 py-3 text-slate-900 focus:outline-none text-lg placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setCurrentPage('listings')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>

            {/* AI Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-left z-20">
                <div className="px-4 py-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center">
                  <Zap className="w-3 h-3 mr-1" /> AI Suggestions
                </div>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSearchQuery(s); setSuggestions([]); }}
                    className="w-full flex items-center px-4 py-3 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* City Availability Status */}
            {searchQuery.length >= 3 && suggestions.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/10 backdrop-blur-md rounded-xl p-3 text-sm font-medium border border-white/20">
                {properties.some(p => p.location.toLowerCase().includes(searchQuery.toLowerCase())) ? (
                  <div className="flex items-center text-emerald-400 justify-center">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Location Available
                  </div>
                ) : (
                  <div className="flex items-center text-rose-400 justify-center">
                    <X className="w-4 h-4 mr-2" /> Location Not Found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">100% Verified Listings</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Instant Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-12 rounded-3xl shadow-xl border border-slate-100 -mt-20 relative z-10">
          {[
            { label: 'Properties', value: '12K+', icon: Building },
            { label: 'Happy Users', value: '25K+', icon: TrendingUp },
            { label: 'Cities', value: '50+', icon: MapPin },
            { label: 'Service Score', value: '4.9/5', icon: Zap }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Featured Selection</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Our Curated Spaces</h2>
          </div>
          <button
            onClick={() => setCurrentPage('listings')}
            className="group flex items-center text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Explore All Listings
            <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-30" />

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Ready to List Your Property?</h2>
          <p className="text-xl text-indigo-100 font-light max-w-2xl mx-auto">
            Join thousands of successful sellers and landlords. List for free and find quality leads in hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl hover:shadow-white/20 active:scale-95"
            >
              Get Started Now
            </button>
            <button className="px-10 py-4 bg-indigo-500 text-white border border-indigo-400 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all active:scale-95">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
