
import { Property, User, Message, PropertyType, UserRole } from './types';

// Initial Mock Data
const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Luxury Apartment in Downtown',
    description: 'Beautiful modern apartment with skyline views.',
    type: PropertyType.RENT,
    price: 45000,
    location: 'Mumbai, Maharashtra',
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    images: ['https://picsum.photos/seed/p1/800/600', 'https://picsum.photos/seed/p1_2/800/600'],
    ownerId: 'u1',
    createdAt: new Date().toISOString(),
    amenities: ['Gym', 'Pool', 'Parking']
  },
  {
    id: 'p2',
    title: 'Cozy Villa near Beach',
    description: 'Perfect for families seeking tranquility.',
    type: PropertyType.BUY,
    price: 15000000, // 1.5 Crore
    location: 'Goa, India',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    images: ['https://picsum.photos/seed/p2/800/600', 'https://picsum.photos/seed/p2_2/800/600'],
    ownerId: 'u2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    amenities: ['Garden', 'Beach Access']
  }
];

class Database {
  private properties: Property[] = JSON.parse(localStorage.getItem('properties') || JSON.stringify(INITIAL_PROPERTIES));
  private users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  private messages: Message[] = JSON.parse(localStorage.getItem('messages') || '[]');
  private wishlist: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');

  constructor() {
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
