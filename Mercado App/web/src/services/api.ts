import { API } from '../types';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
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
  get: (id: number) => request(`/products/${id}`),
  byCategory: (category: string) => request(`/products/category/${category}`),
  promotions: () => request('/products/promotions'),
  create: (data: any) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/products/${id}`, { method: 'DELETE' }),
};

export const orders = {
  list: () => request('/orders'),
  get: (id: number) => request(`/orders/${id}`),
  create: (data: any) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: number, status: string) =>
    request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

export const chat = {
  list: (orderId: number) => request(`/orders/${orderId}/messages`),
  send: (orderId: number, message: string) =>
    request(`/orders/${orderId}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
};
