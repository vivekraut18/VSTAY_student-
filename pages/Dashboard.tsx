
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { db } from '../store';
import { Property, Message, UserRole, PropertyType } from '../types';
import { Plus, Trash2, Edit3, MessageSquare, List, PieChart, ChevronRight, LayoutDashboard, Settings } from 'lucide-react';

export default function Dashboard() {
  const { user, setCurrentPage, setProperties, setEditPropertyId } = useApp();
  const [activeTab, setActiveTab] = useState<'listings' | 'messages' | 'stats'>('listings');
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [myMessages, setMyMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!user) {
      setCurrentPage('auth');
      return;
    }
    setMyProperties(db.getProperties().filter(p => p.ownerId === user.id));
    setMyMessages(db.getMessages(user.id));
  }, [user]);

  const handleDeleteProperty = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      db.deleteProperty(id);
      setMyProperties(prev => prev.filter(p => p.id !== id));
      setProperties(db.getProperties());
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${user.id}`} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{user.role}</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 space-y-1">
            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'listings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <MessageSquare className="w-4 h-4 mr-3" /> Messages
              {myMessages.length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{myMessages.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <PieChart className="w-4 h-4 mr-3" /> Insights
            </button>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button className="w-full flex items-center px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50">
                <Settings className="w-4 h-4 mr-3" /> Profile Settings
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow space-y-8">
          {activeTab === 'listings' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Listings</h1>
                  <p className="text-slate-500 mt-1 font-medium">You have {myProperties.length} active listings</p>
                </div>
                <button
                  className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                  onClick={() => { setEditPropertyId(null); setCurrentPage('listing-builder'); }}
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Property
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myProperties.map(p => (
                  <div key={p.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex gap-4 group">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={p.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{p.type} • ₹{p.price.toLocaleString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditPropertyId(p.id); setCurrentPage('listing-builder'); }} className="p-2 bg-slate-50 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Edit3 className="w-4 h-4" /></button>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="p-2 bg-slate-50 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {myProperties.length === 0 && (
                  <div className="col-span-full py-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                    <List className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No properties yet</h3>
                    <p className="text-slate-500 mt-1">Start by adding your first property to the platform.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recent Messages</h1>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {myMessages.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {myMessages.map(m => (
                      <div key={m.id} className="p-6 flex gap-6 hover:bg-slate-50 transition-colors group">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-indigo-600 font-black">
                          {m.senderName.charAt(0)}
                        </div>
                        <div className="flex-grow space-y-2">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-slate-900">{m.senderName} <span className="text-slate-400 font-normal ml-2">• {new Date(m.createdAt).toLocaleDateString()}</span></h4>
                            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">New Inquiry</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{m.content}</p>
                          <div className="flex space-x-4 pt-2">
                            <button className="text-xs font-black text-indigo-600 flex items-center hover:underline">Reply Now <ChevronRight className="w-4 h-4" /></button>
                            <button className="text-xs font-black text-slate-400 hover:text-red-500">Archive</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No messages found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Insights</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Views', value: '1,284', trend: '+12%', icon: LayoutDashboard },
                  { label: 'Leads', value: '42', trend: '+5%', icon: MessageSquare },
                  { label: 'Rev. Est', value: '₹4.5L', trend: '+22%', icon: PieChart }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex justify-between">
                      <s.icon className="w-6 h-6 text-indigo-500" />
                      <span className="text-emerald-500 text-xs font-black">{s.trend}</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900">{s.value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900 h-[300px] rounded-3xl flex items-center justify-center text-indigo-400 font-bold text-xl border-8 border-white shadow-2xl">
                [ Interactive Analytics Chart ]
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
