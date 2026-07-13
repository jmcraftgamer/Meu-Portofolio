const API = '/api';

function waitForSW() {
  return new Promise<void>((resolve) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      resolve();
    } else if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
      setTimeout(resolve, 2000);
    } else {
      resolve();
    }
  });
}

const swReady = waitForSW();

async function request(path: string, options: RequestInit = {}) {
  await swReady;
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export const api = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { name: string; email: string; password: string; phone?: string; company?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  googleLogin: (data: { email: string; name: string; googleId: string }) =>
    request('/auth/google', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => request('/auth/me'),

  createOrder: (data: {
    type: string; description: string; name: string;
    phone: string; company?: string; deliveryTime: string; features?: string[]
  }) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),

  getOrders: () => request('/orders'),
  getOrder: (id: number) => request(`/orders/${id}`),

  getAdminOrders: () => request('/admin/orders'),
  updateOrderStatus: (id: number, status: string) =>
    request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getAdminStats: () => request('/admin/stats'),

  getMessages: (orderId: number) => request(`/chat/${orderId}`),
  sendMessage: (orderId: number, text: string) =>
    request(`/chat/${orderId}`, { method: 'POST', body: JSON.stringify({ text }) }),
};
