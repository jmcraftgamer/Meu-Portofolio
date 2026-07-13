import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'portfolio-secret-key-2024';

let nextUserId = 1, nextOrderId = 1, nextMsgId = 1, nextProductId = 1;
const users: any[] = [{ id: nextUserId++, name: 'Administrador', email: 'admin@gmail.com', password: bcrypt.hashSync('45677VDTYT', 10), isAdmin: 1, createdAt: new Date().toISOString() }];
const orders: any[] = [];
const messages: any[] = [];
const products: any[] = [
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
for (const p of products) { p.id = nextProductId++; }

function auth(req: any, res: any): any {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return res.status(401).json({ error: 'Invalid token' }); }
}

function parseBody(req: any): Promise<any> {
  return new Promise(resolve => {
    let body = '';
    req.on('data', (chunk: string) => body += chunk);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

const validCategories = ['Mercearia', 'Hortifruit', 'Acougue', 'Padaria', 'Bebidas', 'Biscoitos', 'Higiene', 'Limpeza', 'Utilidades', 'Outros'];

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;
  const method = req.method || 'GET';

  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (method === 'OPTIONS') return res.status(200).end();

    const body = method !== 'GET' ? await parseBody(req) : {};

    // HEALTH CHECK
    if (path === '/api/test') {
      return res.json({ status: 'ok', products: products.length });
    }

    // AUTH
    if (path === '/api/auth/register' && method === 'POST') {
      if (users.find(u => u.email === body.email)) return res.status(400).json({ error: 'Email já cadastrado' });
      const hashedPassword = bcrypt.hashSync(body.password, 10);
      const isAdmin = (body.email || '').toLowerCase() === 'admin@gmail.com' ? 1 : 0;
      const user = { id: nextUserId++, name: body.name, email: body.email, password: hashedPassword, phone: body.phone || '', company: body.company || '', isAdmin, createdAt: new Date().toISOString() };
      users.push(user);
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const user = users.find(u => u.email === body.email);
      if (!user || !user.password) return res.status(400).json({ error: 'Credenciais inválidas' });
      if (!bcrypt.compareSync(body.password, user.password)) return res.status(400).json({ error: 'Credenciais inválidas' });
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
    }

    if (path === '/api/auth/google' && method === 'POST') {
      let user = users.find(u => u.email === body.email);
      if (!user) {
        user = { id: nextUserId++, name: body.name, email: body.email, googleId: body.googleId, isAdmin: 0, createdAt: new Date().toISOString() };
        users.push(user);
      }
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
    }

    if (path === '/api/auth/me') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      const user = users.find(u => u.id === userData.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, company: user.company, isAdmin: user.isAdmin });
    }

    // ORDERS
    if (path === '/api/orders') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      if (method === 'POST') {
        const values: Record<string, number> = { site: 450, app_mobile: 650, app_desktop: 1200 };
        const order = { id: nextOrderId++, userId: userData.id, type: body.type, description: body.description, name: body.name, phone: body.phone, company: body.company || '', deliveryTime: body.deliveryTime, features: JSON.stringify(body.features || []), value: values[body.type] || 0, status: 'pending', createdAt: new Date().toISOString() };
        orders.push(order);
        return res.json(order);
      }
      if (method === 'GET') {
        const userOrders = orders.filter(o => o.userId === userData.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.json(userOrders);
      }
    }

    if (path.startsWith('/api/chat/') && method === 'GET') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      const orderId = parseInt(path.split('/')[3]);
      const order = orders.find(o => o.id === orderId);
      if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
      if (order.userId !== userData.id && !userData.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
      return res.json(messages.filter(m => m.orderId === orderId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    }

    if (path.startsWith('/api/chat/') && method === 'POST') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      const orderId = parseInt(path.split('/')[3]);
      const order = orders.find(o => o.id === orderId);
      if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
      if (order.userId !== userData.id && !userData.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
      messages.push({ id: nextMsgId++, orderId, userId: userData.id, text: body.text, isAdmin: userData.isAdmin ? 1 : 0, createdAt: new Date().toISOString() });
      return res.json(messages.filter(m => m.orderId === orderId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    }

    // PRODUCTS
    if (path === '/api/products' && method === 'GET') {
      return res.json([...products].reverse());
    }

    if (path === '/api/products/promotions' && method === 'GET') {
      return res.json(products.filter(p => p.is_promotion === 1).reverse());
    }

    const categoryMatch = path.match(/^\/api\/products\/category\/(.+)$/);
    if (categoryMatch && method === 'GET') {
      const cat = decodeURIComponent(categoryMatch[1]);
      if (!validCategories.includes(cat)) return res.status(400).json({ error: 'Categoria invalida' });
      return res.json(products.filter(p => p.category === cat).reverse());
    }

    const productIdMatch = path.match(/^\/api\/products\/(\d+)$/);
    if (productIdMatch && method === 'GET') {
      const product = products.find(p => p.id === parseInt(productIdMatch[1]));
      if (!product) return res.status(404).json({ error: 'Produto nao encontrado' });
      return res.json(product);
    }

    if (path === '/api/products' && method === 'POST') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      if (!userData.isAdmin) return res.status(403).json({ error: 'Admin only' });
      if (!body.name || !body.price || !body.category) return res.status(400).json({ error: 'Nome, preco e categoria sao obrigatorios' });
      const product = { id: nextProductId++, name: body.name, description: body.description || '', price: body.price, promo_price: body.promo_price || null, category: body.category, image: body.image || '', is_promotion: body.is_promotion ? 1 : 0, stock: body.stock || 0, created_at: new Date().toISOString() };
      products.push(product);
      return res.status(201).json(product);
    }

    const putMatch = path.match(/^\/api\/products\/(\d+)$/);
    if (putMatch && method === 'PUT') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      if (!userData.isAdmin) return res.status(403).json({ error: 'Admin only' });
      const existing = products.find(p => p.id === parseInt(putMatch[1]));
      if (!existing) return res.status(404).json({ error: 'Produto nao encontrado' });
      Object.assign(existing, { name: body.name ?? existing.name, description: body.description !== undefined ? body.description : existing.description, price: body.price ?? existing.price, promo_price: body.promo_price !== undefined ? body.promo_price : existing.promo_price, category: body.category ?? existing.category, image: body.image !== undefined ? body.image : existing.image, is_promotion: body.is_promotion !== undefined ? (body.is_promotion ? 1 : 0) : existing.is_promotion, stock: body.stock !== undefined ? body.stock : existing.stock });
      return res.json(existing);
    }

    const deleteMatch = path.match(/^\/api\/products\/(\d+)$/);
    if (deleteMatch && method === 'DELETE') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      if (!userData.isAdmin) return res.status(403).json({ error: 'Admin only' });
      const idx = products.findIndex(p => p.id === parseInt(deleteMatch[1]));
      if (idx === -1) return res.status(404).json({ error: 'Produto nao encontrado' });
      products.splice(idx, 1);
      return res.json({ message: 'Produto removido com sucesso' });
    }

    // ADMIN
    if (path === '/api/admin/orders') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      if (!userData.isAdmin) return res.status(403).json({ error: 'Admin only' });
      const adminOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(o => {
        const u = users.find(user => user.id === o.userId);
        return { ...o, userName: u?.name || '', userEmail: u?.email || '', userPhone: u?.phone || '' };
      });
      return res.json(adminOrders);
    }

    const statusMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/status$/);
    if (statusMatch && method === 'PUT') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      if (!userData.isAdmin) return res.status(403).json({ error: 'Admin only' });
      const order = orders.find(o => o.id === parseInt(statusMatch[1]));
      if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
      order.status = body.status;
      return res.json(order);
    }

    if (path === '/api/admin/stats') {
      const userData = auth(req, res);
      if (!userData || userData.error) return;
      if (!userData.isAdmin) return res.status(403).json({ error: 'Admin only' });
      const totalOrders = orders.length;
      const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.value, 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const completedOrders = orders.filter(o => o.status === 'completed').length;
      const inProgressOrders = orders.filter(o => o.status === 'in_progress').length;
      const ordersByType = [...new Set(orders.map(o => o.type))].map(type => ({ type, count: orders.filter(o => o.type === type).length, revenue: orders.filter(o => o.type === type).reduce((s, o) => s + o.value, 0) }));
      return res.json({ totalOrders, totalRevenue, pendingOrders, completedOrders, inProgressOrders, ordersByMonth: [], ordersByType });
    }

    return res.status(404).json({ error: 'Rota não encontrada' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Erro interno' });
  }
}
