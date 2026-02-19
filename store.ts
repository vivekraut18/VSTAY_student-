
import { Property, User, Message, PropertyType, UserRole } from './types';

// Initial Mock Data
const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Shared PG Room (3-Bed) in Viman Nagar',
    description: 'Triple sharing furnished room with comfortable beds, individual lockers, and high-speed Wi-Fi. Ideal for students.',
    type: PropertyType.ROOM_PG,
    price: 8500,
    location: 'Viman Nagar, Pune',
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    images: ['/listings/room1.jpg'],
    ownerId: 'u1',
    createdAt: new Date().toISOString(),
    amenities: ['Wi-Fi', 'Locker', 'Power Backup', 'Cleaning']
  },
  {
    id: 'p2',
    title: 'Twin Sharing PG with AC - Blue Wing',
    description: 'Stylish blue-themed twin sharing room near Symbiosis. Includes study tables and spacious wardrobes.',
    type: PropertyType.ROOM_PG,
    price: 15000,
    location: 'Viman Nagar, Pune',
    bedrooms: 1,
    bathrooms: 1,
    area: 280,
    images: ['/listings/room2.jpg'],
    ownerId: 'u2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    amenities: ['AC', 'Wi-Fi', 'Modular Kitchen', 'Security']
  }
];

class Database {
  private properties: Property[];
  private users: User[];
  private messages: Message[];
  private wishlist: string[];

  constructor() {
    try {
      const stored = localStorage.getItem('properties');
      if (stored && stored.includes('picsum.photos')) {
        // Force refresh if using old placeholders
        this.properties = INITIAL_PROPERTIES;
      } else {
        this.properties = JSON.parse(stored || JSON.stringify(INITIAL_PROPERTIES));
      }
      this.users = JSON.parse(localStorage.getItem('users') || '[]');
      this.messages = JSON.parse(localStorage.getItem('messages') || '[]');
      this.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch (e) {
      console.error("Failed to load data from localStorage, falling back to defaults:", e);
      this.properties = INITIAL_PROPERTIES;
      this.users = [];
      this.messages = [];
      this.wishlist = [];
    }
    this.save();
  }

  private save() {
    localStorage.setItem('properties', JSON.stringify(this.properties));
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('messages', JSON.stringify(this.messages));
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  getProperties() { return this.properties; }

  addProperty(p: Property) {
    this.properties.unshift(p);
    this.save();
  }

  updateProperty(id: string, updates: Partial<Property>) {
    this.properties = this.properties.map(p => p.id === id ? { ...p, ...updates } : p);
    this.save();
  }

  deleteProperty(id: string) {
    this.properties = this.properties.filter(p => p.id !== id);
    this.save();
  }

  getMessages(userId: string) {
    return this.messages.filter(m => m.receiverId === userId || m.senderId === userId);
  }

  addMessage(m: Message) {
    this.messages.unshift(m);
    this.save();
  }

  getWishlist() { return this.wishlist; }

  toggleWishlist(propertyId: string) {
    if (this.wishlist.includes(propertyId)) {
      this.wishlist = this.wishlist.filter(id => id !== propertyId);
    } else {
      this.wishlist.push(propertyId);
    }
    this.save();
  }
}

export const db = new Database();
