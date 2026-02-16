
import React from 'react';
import { Property, PropertyType } from '../types';
import { Heart, MapPin, BedDouble, Bath, Square, ChevronRight } from 'lucide-react';
import { useApp } from '../App';

interface PropertyCardProps {
  property?: Property;
  loading?: boolean;
  key?: React.Key;
}

export default function PropertyCard({ property, loading }: PropertyCardProps) {
  const { wishlist, toggleWishlist, setCurrentPage, setSelectedPropertyId } = useApp();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
        <div className="h-48 bg-slate-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
          <div className="flex space-x-2 pt-2">
            <div className="h-3 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const formatPrice = (price: number, type: PropertyType) => {
    if (type === PropertyType.RENT) {
      return `₹${price.toLocaleString()}/mo`;
    }
    // Buy Logic: Convert to Lakhs or Crores
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const isLiked = wishlist.includes(property.id);

  const handleClick = () => {
    setSelectedPropertyId(property.id);
    setCurrentPage('details');
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${property.type === PropertyType.RENT ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
            {property.type}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(property.id); }}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all ${isLiked ? 'bg-red-500 text-white shadow-lg' : 'bg-white/90 text-slate-400 hover:text-red-500 hover:scale-110'
            }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5" onClick={handleClick}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{property.title}</h3>
        </div>

        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4 py-3 border-y border-slate-50">
          <div className="flex flex-col items-center">
            <span className="flex items-center text-slate-700 text-sm font-semibold">
              <BedDouble className="w-4 h-4 mr-1 text-indigo-500" /> {property.bedrooms}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Beds</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center text-slate-700 text-sm font-semibold">
              <Bath className="w-4 h-4 mr-1 text-indigo-500" /> {property.bathrooms}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Baths</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center text-slate-700 text-sm font-semibold">
              <Square className="w-4 h-4 mr-1 text-indigo-500" /> {property.area}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-slate-900">{formatPrice(property.price, property.type)}</span>
          </div>
          <button className="flex items-center text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
            View Details <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
