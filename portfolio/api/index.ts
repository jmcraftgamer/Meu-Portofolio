import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const JWT_SECRET = 'portfolio-secret-key-2024';

app.use(cors());
app.use(express.json());

type User = { id: number; name: string; email: string; password?: string; googleId?: string; phone?: string; company?: string; isAdmin: number; createdAt: string };
type Order = { id: number; userId: number; type: string; description: string; name: string; phone: string; company?: string; deliveryTime: string; features: string; status: string; value: number; createdAt: string };
type Message = { id: number; orderId: number; userId: number; text: string; isAdmin: number; createdAt: string };
type Product = { id: number; name: string; description?: string; price: number; promo_price?: number | null; category: string; image?: string; is_promotion: number; stock: number; created_at: string };

let nextUserId = 1, nextOrderId = 1, nextMsgId = 1, nextProductId = 1;
const users: User[] = [];
const orders: Order[] = [];
const messages: Message[] = [];
const products: Product[] = [];

const adminHash = bcrypt.hashSync('45677VDTYT', 10);
users.push({ id: nextUserId++, name: 'Administrador', email: 'admin@gmail.com', password: adminHash, isAdmin: 1, createdAt: new Date().toISOString() });

const seedProducts: Omit<Product, 'id'>[] = [
  { name: 'Arroz Branco Tipo 1 - 5kg', description: 'Arroz agulhinha tipo 1, graos selecionados', price: 24.90, promo_price: 19.90, category: 'Mercearia', is_promotion: 1, stock: 50, image: '/images/arroz.png', created_at: new Date().toISOString() },
  { name: 'Feijao Carioca - 1kg', description: 'Feijao carioca tipo 1, embalagem 1kg', price: 7.50, promo_price: null, category: 'Mercearia', is_promotion: 0, stock: 80, image: '/images/feijao.png', created_at: new Date().toISOString() },
  { name: 'Oleo de Soja - 900ml', description: 'Oleo de soja refinado, 900ml', price: 6.80, promo_price: 4.99, category: 'Mercearia', is_promotion: 1, stock: 100, image: '/images/oleo-soja.png', created_at: new Date().toISOString() },
  { name: 'Acucar Cristal - 2kg', description: 'Acucar cristal refinado, pacote 2kg', price: 9.90, promo_price: null, category: 'Mercearia', is_promotion: 0, stock: 60, image: '/images/acucar.png', created_at: new Date().toISOString() },
  { name: 'Cafe Torrado Mo - 500g', description: 'Cafe torrado moido premium, 500g', price: 15.90, promo_price: 12.90, category: 'Mercearia', is_promotion: 1, stock: 40, image: '/images/cafe.png', created_at: new Date().toISOString() },
  { name: 'Macarrao Espaguete - 500g', description: 'Macarrao espaguete grano duro, 500g', price: 4.50, promo_price: null, category: 'Mercearia', is_promotion: 0, stock: 90, image: '/images/macarrao.png', created_at: new Date().toISOString() },
  { name: 'Detergente Liquido - 500ml', description: 'Detergente liquido neutro, 500ml', price: 3.20, promo_price: 2.50, category: 'Limpeza', is_promotion: 1, stock: 120, image: '/images/detergente.png', created_at: new Date().toISOString() },
  { name: 'Agua Sanitaria - 1L', description: 'Agua sanitaria para limpeza geral, 1L', price: 4.90, promo_price: null, category: 'Limpeza', is_promotion: 0, stock: 70, image: '/images/agua-sanitaria.png', created_at: new Date().toISOString() },
  { name: 'Sabao em Po - 1kg', description: 'Sabao em po para lavar roupas, 1kg', price: 12.50, promo_price: 9.90, category: 'Limpeza', is_promotion: 1, stock: 45, image: '/images/sabao-po.png', created_at: new Date().toISOString() },
  { name: 'Desinfetante - 500ml', description: 'Desinfetante perfumado, 500ml', price: 5.50, promo_price: null, category: 'Limpeza', is_promotion: 0, stock: 60, image: '/images/desinfetante.png', created_at: new Date().toISOString() },
  { name: 'Shampoo - 350ml', description: 'Shampoo para todos os tipos de cabelo', price: 18.90, promo_price: 14.90, category: 'Higiene', is_promotion: 1, stock: 35, image: '/images/shampoo.png', created_at: new Date().toISOString() },
  { name: 'Sabonete - 90g', description: 'Sabonete hidratante, 90g', price: 3.50, promo_price: 2.99, category: 'Higiene', is_promotion: 1, stock: 150, image: '/images/sabonete.png', created_at: new Date().toISOString() },
  { name: 'Creme Dental - 90g', description: 'Creme dental com fluor, 90g', price: 6.90, promo_price: null, category: 'Higiene', is_promotion: 0, stock: 80, image: '/images/creme-dental.png', created_at: new Date().toISOString() },
  { name: 'Papel Higienico - 4 rolos', description: 'Papel higienico folha dupla, 4 rolos', price: 8.90, promo_price: 6.90, category: 'Higiene', is_promotion: 1, stock: 100, image: '/images/papel-higienico.png', created_at: new Date().toISOString() },
  { name: 'Biscoito Recheado - 140g', description: 'Biscoito recheado sabor chocolate', price: 3.80, promo_price: null, category: 'Biscoitos', is_promotion: 0, stock: 200, image: '/images/biscoito-recheado.png', created_at: new Date().toISOString() },
  { name: 'Salgadinho de Milho - 80g', description: 'Salgadinho de milho sabor queijo', price: 4.50, promo_price: 3.50, category: 'Biscoitos', is_promotion: 1, stock: 120, image: '/images/salgadinho.png', created_at: new Date().toISOString() },
  { name: 'Bolacha Agua e Sal - 200g', description: 'Bolacha agua e sal tradicional', price: 3.20, promo_price: null, category: 'Biscoitos', is_promotion: 0, stock: 90, image: '/images/bolacha-agua-sal.png', created_at: new Date().toISOString() },
  { name: 'Biscoito Maizena - 200g', description: 'Biscoito maizena tradicional', price: 4.20, promo_price: 3.20, category: 'Biscoitos', is_promotion: 1, stock: 75, image: '/images/biscoito-maizena.png', created_at: new Date().toISOString() },
  { name: 'Patinho Moido - 500g', description: 'Patinho moido fresco, bandeja 500g', price: 22.90, promo_price: 19.90, category: 'Acougue', is_promotion: 1, stock: 25, image: '/images/patinho-moido.png', created_at: new Date().toISOString() },
  { name: 'Peito de Frango - 1kg', description: 'Peito de frango resfriado, 1kg', price: 16.90, promo_price: null, category: 'Acougue', is_promotion: 0, stock: 30, image: '/images/peito-frango.png', created_at: new Date().toISOString() },
  { name: 'Costela Bovina - 1kg', description: 'Costela bovina para cozido, 1kg', price: 28.90, promo_price: 24.90, category: 'Acougue', is_promotion: 1, stock: 15, image: '/images/costela-bovina.png', created_at: new Date().toISOString() },
  { name: 'Linguica Calabresa - 500g', description: 'Linguica calabresa defumada, 500g', price: 14.90, promo_price: null, category: 'Acougue', is_promotion: 0, stock: 40, image: '/images/linguica-calabresa.png', created_at: new Date().toISOString() },
];
for (const p of seedProducts) { products.push({ id: nextProductId++, ...p }); }

function auth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
}

function adminAuth(req: any, res: any, next: any) {
  auth(req, res, () => { if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' }); next(); });
}

app.post('/api/auth/register', (req: any, res) => {
  const { name, email, password, phone, company } = req.body;
  try {
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email já cadastrado' });
    const hashedPassword = bcrypt.hashSync(password, 10);
    const isAdmin = email.toLowerCase() === 'admin@gmail.com' ? 1 : 0;
    const user: User = { id: nextUserId++, name, email, password: hashedPassword, phone: phone || '', company: company || '', isAdmin, createdAt: new Date().toISOString() };
    users.push(user);
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

app.post('/api/auth/login', (req: any, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !user.password) return res.status(400).json({ error: 'Credenciais inválidas' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: 'Credenciais inválidas' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
});

app.post('/api/auth/google', (req: any, res) => {
  const { email, name, googleId } = req.body;
  try {
    let user = users.find(u => u.email === email);
    if (!user) {
      const isAdmin = email.toLowerCase() === 'admin@gmail.com' ? 1 : 0;
      user = { id: nextUserId++, name, email, googleId, isAdmin, createdAt: new Date().toISOString() };
      users.push(user);
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

app.get('/api/auth/me', auth, (req: any, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, company: user.company, isAdmin: user.isAdmin });
});

app.post('/api/orders', auth, (req: any, res) => {
  const { type, description, name, phone, company, deliveryTime, features } = req.body;
  const values: Record<string, number> = { site: 450, app_mobile: 650, app_desktop: 1200 };
  const value = values[type] || 0;
  const order: Order = { id: nextOrderId++, userId: req.user.id, type, description, name, phone, company: company || '', deliveryTime, features: JSON.stringify(features || []), value, status: 'pending', createdAt: new Date().toISOString() };
  orders.push(order);
  res.json(order);
});

app.get('/api/orders', auth, (req: any, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(userOrders);
});

app.get('/api/orders/:id', auth, (req: any, res) => {
  const order = orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json(order);
});

const validCategories = ['Mercearia', 'Hortifruit', 'Acougue', 'Padaria', 'Bebidas', 'Biscoitos', 'Higiene', 'Limpeza', 'Utilidades', 'Outros'];

app.get('/api/products', (_req: any, res) => {
  res.json([...products].reverse());
});

app.get('/api/products/promotions', (_req: any, res) => {
  res.json(products.filter(p => p.is_promotion === 1).reverse());
});

app.get('/api/products/category/:category', (req: any, res) => {
  const { category } = req.params;
  if (!validCategories.includes(category)) return res.status(400).json({ error: 'Categoria invalida' });
  res.json(products.filter(p => p.category === category).reverse());
});

app.get('/api/products/:id', (req: any, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Produto nao encontrado' });
  res.json(product);
});

app.post('/api/products', adminAuth, (req: any, res) => {
  const { name, description, price, promo_price, category, image, is_promotion, stock } = req.body;
  if (!name || !price || !category) return res.status(400).json({ error: 'Nome, preco e categoria sao obrigatorios' });
  const product: Product = { id: nextProductId++, name, description: description || '', price, promo_price: promo_price || null, category, image: image || '', is_promotion: is_promotion ? 1 : 0, stock: stock || 0, created_at: new Date().toISOString() };
  products.push(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', adminAuth, (req: any, res) => {
  const existing = products.find(p => p.id === Number(req.params.id));
  if (!existing) return res.status(404).json({ error: 'Produto nao encontrado' });
  const { name, description, price, promo_price, category, image, is_promotion, stock } = req.body;
  Object.assign(existing, {
    name: name ?? existing.name,
    description: description !== undefined ? description : existing.description,
    price: price ?? existing.price,
    promo_price: promo_price !== undefined ? promo_price : existing.promo_price,
    category: category ?? existing.category,
    image: image !== undefined ? image : existing.image,
    is_promotion: is_promotion !== undefined ? (is_promotion ? 1 : 0) : existing.is_promotion,
    stock: stock !== undefined ? stock : existing.stock,
  });
  res.json(existing);
});

app.delete('/api/products/:id', adminAuth, (req: any, res) => {
  const idx = products.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Produto nao encontrado' });
  products.splice(idx, 1);
  res.json({ message: 'Produto removido com sucesso' });
});

app.get('/api/admin/orders', adminAuth, (_req: any, res) => {
  const adminOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(o => {
    const u = users.find(user => user.id === o.userId);
    return { ...o, userName: u?.name || '', userEmail: u?.email || '', userPhone: u?.phone || '' };
  });
  res.json(adminOrders);
});

app.put('/api/admin/orders/:id/status', adminAuth, (req: any, res) => {
  const order = orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  order.status = req.body.status;
  res.json(order);
});

app.get('/api/admin/stats', adminAuth, (_req: any, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.value, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const inProgressOrders = orders.filter(o => o.status === 'in_progress').length;
  const ordersByMonth = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    const monthOrders = orders.filter(o => o.createdAt?.startsWith(`202${i >= new Date().getMonth() ? 4 : 5}-${month}`) || o.createdAt?.includes(`-${month}-`));
    return { month, count: monthOrders.length, revenue: monthOrders.reduce((s, o) => s + o.value, 0) };
  }).filter(m => m.count > 0 || m.revenue > 0);
  const ordersByType = [...new Set(orders.map(o => o.type))].map(type => {
    const typeOrders = orders.filter(o => o.type === type);
    return { type, count: typeOrders.length, revenue: typeOrders.reduce((s, o) => s + o.value, 0) };
  });
  res.json({ totalOrders, totalRevenue, pendingOrders, completedOrders, inProgressOrders, ordersByMonth, ordersByType });
});

app.get('/api/chat/:orderId', auth, (req: any, res) => {
  const order = orders.find(o => o.id === Number(req.params.orderId));
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
  if (order.userId !== req.user.id && !req.user.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
  const chatMessages = messages.filter(m => m.orderId === Number(req.params.orderId)).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  res.json(chatMessages);
});

app.post('/api/chat/:orderId', auth, (req: any, res) => {
  const { text } = req.body;
  const order = orders.find(o => o.id === Number(req.params.orderId));
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
  if (order.userId !== req.user.id && !req.user.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
  const isAdmin = req.user.isAdmin ? 1 : 0;
  messages.push({ id: nextMsgId++, orderId: Number(req.params.orderId), userId: req.user.id, text, isAdmin, createdAt: new Date().toISOString() });
  const chatMessages = messages.filter(m => m.orderId === Number(req.params.orderId)).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  res.json(chatMessages);
});

export default app;
