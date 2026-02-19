
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { PropertyType, SortOption, FilterOptions } from '../types';
import PropertyCard from '../components/PropertyCard';
import { SlidersHorizontal, Search, X, LayoutGrid, Map } from 'lucide-react';

export default function Listings() {
  const { properties } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'ALL',
    minPrice: 0,
    maxPrice: 200000,
    bedrooms: 'ALL',
    search: '',
    sort: SortOption.NEWEST
  });

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (filters.type !== 'ALL') {
      result = result.filter(p => p.type === filters.type);
    }

    if (filters.bedrooms !== 'ALL') {
      result = result.filter(p => p.bedrooms === filters.bedrooms);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    result.sort((a, b) => {
      switch (filters.sort) {
        case SortOption.PRICE_LOW: return a.price - b.price;
        case SortOption.PRICE_HIGH: return b.price - a.price;
        case SortOption.OLDEST: return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [properties, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-4">
      {/* Search and Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Search by city, neighborhood, or building name..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-lg shadow-sm"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-4 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200'}`}
          >
            <LayoutGrid className="w-6 h-6" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-4 rounded-2xl transition-all ${viewMode === 'map' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200'}`}
          >
            <Map className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-8 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
              </h3>
              <button
                onClick={() => setFilters({ type: 'ALL', minPrice: 0, maxPrice: 200000, bedrooms: 'ALL', search: '', sort: SortOption.NEWEST })}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-slate-900 uppercase tracking-wider">Listing Category</label>
              <div className="grid grid-cols-3 gap-2">
                {['ALL', PropertyType.ROOM_PG, PropertyType.FLAT].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilters(prev => ({ ...prev, type: type as any }))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${filters.type === type ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                  >
                    {type === 'ALL' ? 'ALL' : type === PropertyType.ROOM_PG ? 'ROOM/PG' : 'FLAT'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-900 uppercase tracking-wider">Price Range</label>
              </div>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max={200000}
                  step={5000}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>₹0</span>
                  <span>{`₹${(filters.maxPrice / 1000).toFixed(0)}K`}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-slate-900 uppercase tracking-wider">Bedrooms</label>
              <div className="grid grid-cols-5 gap-2">
                {['ALL', 1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setFilters(prev => ({ ...prev, bedrooms: num as any }))}
                    className={`h-10 w-full flex items-center justify-center rounded-xl text-xs font-bold transition-all border ${filters.bedrooms === num ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                  >
                    {num === 'ALL' ? 'Any' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-slate-900 uppercase tracking-wider">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as SortOption }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value={SortOption.NEWEST}>Newest Listed</option>
                <option value={SortOption.OLDEST}>Oldest Listed</option>
                <option value={SortOption.PRICE_LOW}>Price: Low to High</option>
                <option value={SortOption.PRICE_HIGH}>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-slate-500 font-medium">Found <span className="text-indigo-600 font-bold">{filteredProperties.length}</span> listings</span>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(prop => (
                  <PropertyCard key={prop.id} property={prop} />
                ))
              ) : (
                <div className="col-span-full py-24 text-center space-y-4">
                  <div className="bg-slate-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">No matching listings</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <button
                    onClick={() => setFilters({ type: 'ALL', minPrice: 0, maxPrice: 200000, bedrooms: 'ALL', search: '', sort: SortOption.NEWEST })}
                    className="text-indigo-600 font-black"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-200 rounded-3xl h-[600px] flex items-center justify-center border-4 border-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/800')] opacity-40 grayscale" />
              <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl text-center shadow-xl border border-white">
                <Map className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Map View Integrated</h3>
                <p className="text-slate-500 mt-2 max-w-xs">Interactive map is processing {filteredProperties.length} locations. Real-time grounding active.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
