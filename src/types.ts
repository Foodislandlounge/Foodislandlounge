export type Category = 'Food' | 'Drinks';

export interface MenuItem {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: Category;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  specialInstructions?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: any; // Firestore Timestamp
}

export interface Reservation {
  id?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}
