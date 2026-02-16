
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Property, PropertyType, Message } from '../types';
import { db } from '../store';
import { getPropertyDescription, getNearbyFacilities } from '../services/geminiService';
import { Heart, MapPin, Share2, BedDouble, Bath, Square, Calendar, Send, ShieldCheck, MessageCircle, ChevronLeft, Sparkles } from 'lucide-react';

export default function PropertyDetail({ id }: { id: string }) {
  const { user, wishlist, toggleWishlist, setCurrentPage, properties } = useApp();
  const property = properties.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [aiDesc, setAiDesc] = useState('');
  const [nearbyInfo, setNearbyInfo] = useState('');
  const [loadingAi, setLoadingAi] = useState(true);

  useEffect(() => {
    if (property) {
      window.scrollTo(0, 0);
      const fetchAiContent = async () => {
        setLoadingAi(true);
        const [desc, facilities] = await Promise.all([
          getPropertyDescription(property),
          getNearbyFacilities(property.location)
        ]);
        setAiDesc(desc);
        setNearbyInfo(facilities);
        setLoadingAi(false);
      };
      fetchAiContent();
    }
  }, [property]);

  if (!property) return <div className="p-20 text-center">Property not found.</div>;

  const isLiked = wishlist.includes(property.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setCurrentPage('auth');
      return;
    }
    setIsSending(true);
    const form = e.target as HTMLFormElement;
    const content = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    
    setTimeout(() => {
      const msg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        receiverId: property.ownerId,
        propertyId: property.id,
        content: content,
        createdAt: new Date().toISOString()
      };
      db.addMessage(msg);
      setIsSending(false);
      setMessageSent(true);
      form.reset();
    }, 1000);
  };

  const formatPrice = (price: number, type: PropertyType) => {
    if (type === PropertyType.RENT) return `₹${price.toLocaleString()}/mo`;
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    return `₹${(price / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setCurrentPage('listings')}
            className="flex items-center text-slate-600 font-bold hover:text-indigo-600"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Search
          </button>
          <div className="flex space-x-3">
            <button className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => toggleWishlist(property.id)}
              className={`p-2.5 rounded-xl border transition-all flex items-center space-x-2 ${
                isLiked ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-bold">{isLiked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-video bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative group">
                <img 
                  src={property.images[activeImage]} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-2 custom-scrollbar">
                {property.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center space-x-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                      property.type === PropertyType.RENT ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      For {property.type}
                    </span>
                    <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" /> Added {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                 </div>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tight">{property.title}</h1>
                 <div className="flex items-center text-slate-500 text-lg">
                    <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
                    {property.location}
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-6 py-8 border-y border-slate-100">
                <div className="flex flex-col items-center p-4 bg-indigo-50/50 rounded-2xl">
                  <BedDouble className="w-6 h-6 text-indigo-600 mb-2" />
                  <span className="text-xl font-black text-slate-900">{property.bedrooms}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-indigo-50/50 rounded-2xl">
                  <Bath className="w-6 h-6 text-indigo-600 mb-2" />
                  <span className="text-xl font-black text-slate-900">{property.bathrooms}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-indigo-50/50 rounded-2xl">
                  <Square className="w-6 h-6 text-indigo-600 mb-2" />
                  <span className="text-xl font-black text-slate-900">{property.area}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase">Sqft Area</span>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-xl font-bold text-slate-900">About this Property</h3>
                 <p className="text-slate-600 leading-relaxed text-lg">
                   {property.description}
                 </p>
              </div>

              {/* AI Insight Box */}
              <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                   <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center space-x-2">
                     <Sparkles className="w-5 h-5 text-amber-300" />
                     <span className="font-black uppercase tracking-widest text-xs opacity-80">AI Property Insight</span>
                   </div>
                   {loadingAi ? (
                     <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-white/20 rounded w-full" />
                        <div className="h-4 bg-white/20 rounded w-5/6" />
                        <div className="h-4 bg-white/20 rounded w-4/6" />
                     </div>
                   ) : (
                     <p className="text-indigo-50 font-medium leading-relaxed italic">
                       "{aiDesc}"
                     </p>
                   )}
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-xl font-bold text-slate-900">Amenities</h3>
                 <div className="flex flex-wrap gap-3">
                   {property.amenities.map((a, i) => (
                     <span key={i} className="px-5 py-2.5 bg-slate-100 rounded-2xl text-slate-700 text-sm font-bold flex items-center">
                       <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" /> {a}
                     </span>
                   ))}
                 </div>
              </div>

              {/* Nearby */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-slate-900">Nearby Facilities</h3>
                {loadingAi ? (
                  <div className="animate-pulse h-20 bg-slate-100 rounded-2xl" />
                ) : (
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-slate-600 text-sm leading-loose whitespace-pre-wrap">
                    {nearbyInfo}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact & Price */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-36 space-y-8">
              <div>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Price</span>
                <div className="text-4xl font-black text-slate-900 mt-1">{formatPrice(property.price, property.type)}</div>
              </div>

              {messageSent ? (
                <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl text-center space-y-4 animate-in zoom-in duration-300 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Send className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-lg">Message Sent!</h4>
                  <p className="text-sm">The property owner will get back to you shortly via email or dashboard.</p>
                  <button 
                    onClick={() => setMessageSent(false)}
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Contact Agent</h3>
                  <div className="space-y-4">
                    <textarea 
                      name="message"
                      required
                      placeholder="I'm interested in this property. Can we schedule a viewing?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 min-h-[120px] transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={isSending}
                      className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 disabled:opacity-50"
                    >
                      {isSending ? 'Sending...' : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">
                    Response time: ~2 hours
                  </p>
                </form>
              )}

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat via WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0">
                   <img src={`https://i.pravatar.cc/150?u=${property.ownerId}`} className="w-full h-full rounded-full" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Verified Seller</div>
                  <div className="text-xs text-slate-500">Member since 2021</div>
                </div>
                <div className="flex-grow text-right">
                   <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg">PRO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
