export interface Product {
  id: string;
  name: string;
  description: string;
  mfdDate: Date;
  expiryDate: Date;
  price: number;
  quantity: number; // Added for stock tracking
} 