export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  promo_price: number | null;
  category: 'Limpeza' | 'Higiene' | 'Mercearia' | 'Biscoitos' | 'Acougue';
  image: string;
  is_promotion: number;
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
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  notes: string;
  delivery_name: string;
  troco: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  order_id: number;
  user_id: number;
  sender_role: 'user' | 'admin';
  message: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export const CATEGORIES = ['Limpeza', 'Higiene', 'Mercearia', 'Biscoitos', 'Acougue'] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  preparing: 'Em separacao',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export const API = 'http://localhost:3001/api';
