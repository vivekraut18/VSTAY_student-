
import React from 'react';
import { useApp } from '../App';
import PropertyCard from '../components/PropertyCard';
import { Heart, Search } from 'lucide-react';

export default function Wishlist() {
  const { properties, wishlist, setCurrentPage } = useApp();
  const likedProperties = properties.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Your Favorites</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Saved Listings</h1>
        </div>
        <button
          onClick={() => setCurrentPage('listings')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
        >
          Discover More
        </button>
      </div>

      {likedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {likedProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-xl space-y-6">
          <div className="bg-red-50 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-red-500">
            <Heart className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your wishlist is empty</h2>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">Save listings you love to see them here later. They'll stay saved even after you refresh.</p>
          <button
            onClick={() => setCurrentPage('listings')}
            className="inline-flex items-center space-x-2 text-indigo-600 font-black text-lg group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Start Browsing Listings</span>
          </button>
        </div>
      )}
    </div>
  );
}
