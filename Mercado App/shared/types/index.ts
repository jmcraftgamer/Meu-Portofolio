export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  promo_price: number | null;
  category: string;
  image: string;
  is_promotion: boolean;
  stock: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type ProductCategory = 'Limpeza' | 'Higiene' | 'Mercearia' | 'Biscoitos' | 'Acougue';
