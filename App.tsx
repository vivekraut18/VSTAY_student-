
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole, Property, PropertyType, SortOption, FilterOptions } from './types';
import { db } from './store';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import Dashboard from './pages/Dashboard';
import PropertyDetail from './pages/PropertyDetail';
import Wishlist from './pages/Wishlist';
import Auth from './pages/Auth';
import ListingBuilder from './pages/ListingBuilder';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Context
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  editPropertyId: string | null;
  setEditPropertyId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>(db.getProperties());
  const [wishlist, setWishlist] = useState<string[]>(db.getWishlist());
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);

  // Persistence logic simulation
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('currentUser', JSON.stringify(u));
    else localStorage.removeItem('currentUser');
  };

  const toggleWishlist = (id: string) => {
    db.toggleWishlist(id);
    setWishlist([...db.getWishlist()]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home />;
      case 'listings': return <Listings />;
      case 'dashboard': return <Dashboard />;
      case 'wishlist': return <Wishlist />;
      case 'auth': return <Auth onComplete={() => setCurrentPage('home')} />;
      case 'details': return selectedPropertyId ? <PropertyDetail id={selectedPropertyId} /> : <Home />;
      case 'listing-builder': return <ListingBuilder />;
      default: return <Home />;
    }
  };

  return (
    <AppContext.Provider value={{
      user, setUser: handleSetUser,
      properties, setProperties,
      wishlist, toggleWishlist,
      currentPage, setCurrentPage,
      selectedPropertyId, setSelectedPropertyId,
      editPropertyId, setEditPropertyId
    }}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
}
