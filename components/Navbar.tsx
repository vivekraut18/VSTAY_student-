
import React, { useState } from 'react';
import { useApp } from '../App';
import { Menu, X, Home, Search, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, setUser, currentPage, setCurrentPage } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'listings', label: 'Explore', icon: Search },
    { id: 'wishlist', label: 'Saved', icon: Heart, protected: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
  ];

  const handleNavigate = (id: string) => {
    setCurrentPage(id);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigate('home')}
          >
            <div className="bg-indigo-600 p-2 rounded-lg mr-2">
              <Home className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">RoomFinder<span className="text-indigo-600">Pro</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              (!link.protected || user) && (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`flex items-center text-sm font-medium transition-colors ${
                    currentPage === link.id ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <link.icon className="w-4 h-4 mr-1.5" />
                  {link.label}
                </button>
              )
            ))}
            {user ? (
              <div className="flex items-center space-x-4 border-l pl-8 border-slate-200">
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate('auth')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              (!link.protected || user) && (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-xl text-left text-base font-medium ${
                    currentPage === link.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <link.icon className="w-5 h-4 mr-3" />
                  {link.label}
                </button>
              )
            ))}
            {!user ? (
              <button
                onClick={() => handleNavigate('auth')}
                className="w-full bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold text-center"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
