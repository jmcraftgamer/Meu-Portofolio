import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../types';

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisicao');
  return data;
}

export const auth = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => request('/auth/me'),
};

export const products = {
  list: () => request('/products'),
  byCategory: (category: string) => request(`/products/category/${category}`),
  promotions: () => request('/products/promotions'),
};

export const orders = {
  list: () => request('/orders'),
  create: (data: any) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
};

export const admin = {
  updateOrderStatus: (id: number, status: string) =>
    request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createProduct: (data: any) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: number, data: any) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: number) => request(`/products/${id}`, { method: 'DELETE' }),
};

export const chat = {
  list: (orderId: number) => request(`/orders/${orderId}/messages`),
  send: (orderId: number, message: string) =>
    request(`/orders/${orderId}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
};
