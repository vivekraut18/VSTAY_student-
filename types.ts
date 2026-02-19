
export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export enum PropertyType {
  ROOM_PG = 'ROOM_PG',
  FLAT = 'FLAT'
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number; // For Rent: monthly. For Buy: Total value.
  location: string;
  coordinates?: { lat: number; lng: number };
  bedrooms: number;
  bathrooms: number;
  area: number; // sqft
  images: string[];
  ownerId: string;
  createdAt: string;
  amenities: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId: string;
  content: string;
  createdAt: string;
  senderName: string;
  senderEmail: string;
}

export interface FilterOptions {
  type: PropertyType | 'ALL';
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'ALL';
  search: string;
  sort: SortOption;
}

export enum SortOption {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  PRICE_LOW = 'PRICE_LOW',
  PRICE_HIGH = 'PRICE_HIGH'
}
