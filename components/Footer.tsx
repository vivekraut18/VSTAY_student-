
import React from 'react';
import { Home, Mail, Phone, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-600 p-2 rounded-lg mr-2">
                <Home className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">RoomFinderPro</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Elevating the search experience with AI-powered matching for verified Rooms, PGs and Rented Flats. Your perfect space is just a click away.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home Search</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Market Trends</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Room & Flat Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-indigo-500" />
                info@roomfinderpro.com
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-indigo-500" />
                +91 98765 43210
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-indigo-500" />
                Pune
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-indigo-600 transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-indigo-600 transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.linkedin.com/in/vivekraut18" className="bg-slate-800 p-2 rounded-lg hover:bg-indigo-600 transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} RoomFinderPro Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const MapPin = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
