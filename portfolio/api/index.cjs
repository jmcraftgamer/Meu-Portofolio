var redis = null;
try {
  var Redis = require('@upstash/redis');
  if (process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL) {
    redis = new Redis.Redis({
      url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (e) {}

var SEED_PRODUCTS = [
  { name: 'Arroz Branco Tipo 1 - 5kg', description: 'Arroz agulhinha tipo 1, graos selecionados', price: 24.90, promo_price: 19.90, category: 'Mercearia', image: '/apps/mercado/web/images/arroz.png', is_promotion: 1, stock: 50 },
  { name: 'Feijao Carioca - 1kg', description: 'Feijao carioca tipo 1, embalagem 1kg', price: 7.50, promo_price: null, category: 'Mercearia', image: '/apps/mercado/web/images/feijao.png', is_promotion: 0, stock: 80 },
  { name: 'Oleo de Soja - 900ml', description: 'Oleo de soja refinado, 900ml', price: 6.80, promo_price: 4.99, category: 'Mercearia', is_promotion: 1, stock: 100, image: '/apps/mercado/web/images/oleo-soja.png' },
  { name: 'Acucar Cristal - 2kg', description: 'Acucar cristal refinado, pacote 2kg', price: 9.90, promo_price: null, category: 'Mercearia', is_promotion: 0, stock: 60, image: '/apps/mercado/web/images/acucar.png' },
  { name: 'Cafe Torrado Mo - 500g', description: 'Cafe torrado moido premium, 500g', price: 15.90, promo_price: 12.90, category: 'Mercearia', is_promotion: 1, stock: 40, image: '/apps/mercado/web/images/cafe.png' },
  { name: 'Macarrao Espaguete - 500g', description: 'Macarrao espaguete grano duro, 500g', price: 4.50, promo_price: null, category: 'Mercearia', is_promotion: 0, stock: 90, image: '/apps/mercado/web/images/macarrao.png' },
  { name: 'Detergente Liquido - 500ml', description: 'Detergente liquido neutro, 500ml', price: 3.20, promo_price: 2.50, category: 'Limpeza', is_promotion: 1, stock: 120, image: '/apps/mercado/web/images/detergente.png' },
  { name: 'Agua Sanitaria - 1L', description: 'Agua sanitaria para limpeza geral, 1L', price: 4.90, promo_price: null, category: 'Limpeza', is_promotion: 0, stock: 70, image: '/apps/mercado/web/images/agua-sanitaria.png' },
  { name: 'Sabao em Po - 1kg', description: 'Sabao em po para lavar roupas, 1kg', price: 12.50, promo_price: 9.90, category: 'Limpeza', is_promotion: 1, stock: 45, image: '/apps/mercado/web/images/sabao-po.png' },
  { name: 'Desinfetante - 500ml', description: 'Desinfetante perfumado, 500ml', price: 5.50, promo_price: null, category: 'Limpeza', is_promotion: 0, stock: 60, image: '/apps/mercado/web/images/desinfetante.png' },
  { name: 'Shampoo - 350ml', description: 'Shampoo para todos os tipos de cabelo', price: 18.90, promo_price: 14.90, category: 'Higiene', is_promotion: 1, stock: 35, image: '/apps/mercado/web/images/shampoo.png' },
  { name: 'Sabonete - 90g', description: 'Sabonete hidratante, 90g', price: 3.50, promo_price: 2.99, category: 'Higiene', is_promotion: 1, stock: 150, image: '/apps/mercado/web/images/sabonete.png' },
  { name: 'Creme Dental - 90g', description: 'Creme dental com fluor, 90g', price: 6.90, promo_price: null, category: 'Higiene', is_promotion: 0, stock: 80, image: '/apps/mercado/web/images/creme-dental.png' },
  { name: 'Papel Higienico - 4 rolos', description: 'Papel higienico folha dupla, 4 rolos', price: 8.90, promo_price: 6.90, category: 'Higiene', is_promotion: 1, stock: 100, image: '/apps/mercado/web/images/papel-higienico.png' },
  { name: 'Biscoito Recheado - 140g', description: 'Biscoito recheado sabor chocolate', price: 3.80, promo_price: null, category: 'Biscoitos', is_promotion: 0, stock: 200, image: '/apps/mercado/web/images/biscoito-recheado.png' },
  { name: 'Salgadinho de Milho - 80g', description: 'Salgadinho de milho sabor queijo', price: 4.50, promo_price: 3.50, category: 'Biscoitos', is_promotion: 1, stock: 120, image: '/apps/mercado/web/images/salgadinho.png' },
  { name: 'Bolacha Agua e Sal - 200g', description: 'Bolacha agua e sal tradicional', price: 3.20, promo_price: null, category: 'Biscoitos', is_promotion: 0, stock: 90, image: '/apps/mercado/web/images/bolacha-agua-sal.png' },
  { name: 'Biscoito Maizena - 200g', description: 'Biscoito maizena tradicional', price: 4.20, promo_price: 3.20, category: 'Biscoitos', is_promotion: 1, stock: 75, image: '/apps/mercado/web/images/biscoito-maizena.png' },
  { name: 'Patinho Moido - 500g', description: 'Patinho moido fresco, bandeja 500g', price: 22.90, promo_price: 19.90, category: 'Acougue', is_promotion: 1, stock: 25, image: '/apps/mercado/web/images/patinho-moido.png' },
  { name: 'Peito de Frango - 1kg', description: 'Peito de frango resfriado, 1kg', price: 16.90, promo_price: null, category: 'Acougue', is_promotion: 0, stock: 30, image: '/apps/mercado/web/images/peito-frango.png' },
  { name: 'Costela Bovina - 1kg', description: 'Costela bovina para cozido, 1kg', price: 28.90, promo_price: 24.90, category: 'Acougue', is_promotion: 1, stock: 15, image: '/apps/mercado/web/images/costela-bovina.png' },
  { name: 'Linguica Calabresa - 500g', description: 'Linguica calabresa defumada, 500g', price: 14.90, promo_price: null, category: 'Acougue', is_promotion: 0, stock: 40, image: '/apps/mercado/web/images/linguica-calabresa.png' },
];

var VALID_CATEGORIES = ['Mercearia', 'Hortifruit', 'Acougue', 'Padaria', 'Bebidas', 'Biscoitos', 'Higiene', 'Limpeza', 'Utilidades', 'Outros'];

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-2024';

// In-memory fallback
var memUsers = [{ id: 1, name: 'Administrador', email: 'admin@gmail.com', password: bcrypt.hashSync('45677VDTYT', 10), phone: '(11) 99999-0000', company: 'DevPro', isAdmin: 1, createdAt: new Date().toISOString() }];
var memOrders = [];
var memMessages = [];
var memNextUserId = 2;
var memNextOrderId = 1;
var memNextMsgId = 1;

async function getData() {
  if (redis) {
    try {
      var seeded = await redis.get('seeded');
      if (!seeded) {
        await redis.set('seeded', '1');
        await redis.set('users', JSON.stringify(memUsers));
        await redis.set('orders', JSON.stringify(memOrders));
        await redis.set('messages', JSON.stringify(memMessages));
        await redis.set('nextUserId', memNextUserId);
        await redis.set('nextOrderId', memNextOrderId);
        await redis.set('nextMsgId', memNextMsgId);
      }
      return {
        users: JSON.parse(await redis.get('users') || '[]'),
        orders: JSON.parse(await redis.get('orders') || '[]'),
        messages: JSON.parse(await redis.get('messages') || '[]'),
        nextUserId: parseInt(await redis.get('nextUserId') || '2'),
        nextOrderId: parseInt(await redis.get('nextOrderId') || '1'),
        nextMsgId: parseInt(await redis.get('nextMsgId') || '1'),
      };
    } catch (e) { /* fallback to memory */ }
  }
  return { users: memUsers, orders: memOrders, messages: memMessages, nextUserId: memNextUserId, nextOrderId: memNextOrderId, nextMsgId: memNextMsgId };
}

async function saveData(data) {
  if (redis) {
    try {
      await redis.set('users', JSON.stringify(data.users));
      await redis.set('orders', JSON.stringify(data.orders));
      await redis.set('messages', JSON.stringify(data.messages));
      await redis.set('nextUserId', data.nextUserId);
      await redis.set('nextOrderId', data.nextOrderId);
      await redis.set('nextMsgId', data.nextMsgId);
    } catch (e) {}
  } else {
    memUsers = data.users;
    memOrders = data.orders;
    memMessages = data.messages;
    memNextUserId = data.nextUserId;
    memNextOrderId = data.nextOrderId;
    memNextMsgId = data.nextMsgId;
  }
}

var products = SEED_PRODUCTS.map(function(p, i) { return { id: i + 1, ...p, created_at: new Date().toISOString() }; });

function parseBody(req) {
  return new Promise(function(resolve) {
    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try { resolve(JSON.parse(body)); } catch (e) { resolve({}); }
    });
  });
}

function auth(req) {
  var header = req.headers.authorization;
  if (!header) return null;
  var token = header.split(' ')[1];
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch (e) { return null; }
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    var url = new URL(req.url, 'http://localhost');
    var path = url.searchParams.get('__path') || url.pathname;
    var method = req.method;
    var body = method !== 'GET' ? await parseBody(req) : {};

    var data = await getData();
    var { users, orders, messages } = data;

    // AUTH
    if (path === '/api/auth/register' && method === 'POST') {
      if (users.find(function(u) { return u.email === body.email; }))
        return send(res, 400, { error: 'Email já cadastrado' });
      var hp = bcrypt.hashSync(body.password, 10);
      var u = { id: data.nextUserId++, name: body.name, email: body.email, password: hp, phone: body.phone || '', company: body.company || '', isAdmin: 0, createdAt: new Date().toISOString() };
      users.push(u);
      await saveData(data);
      var tk = jwt.sign({ id: u.id, email: u.email, name: u.name, isAdmin: u.isAdmin }, JWT_SECRET);
      return send(res, 200, { token: tk, user: { id: u.id, name: u.name, email: u.email, isAdmin: !!u.isAdmin } });
    }

    if (path === '/api/auth/login' && method === 'POST') {
      var u = users.find(function(u) { return u.email === body.email; });
      if (!u || !u.password) return send(res, 400, { error: 'Credenciais inválidas' });
      if (!bcrypt.compareSync(body.password, u.password)) return send(res, 400, { error: 'Credenciais inválidas' });
      var tk = jwt.sign({ id: u.id, email: u.email, name: u.name, isAdmin: u.isAdmin }, JWT_SECRET);
      return send(res, 200, { token: tk, user: { id: u.id, name: u.name, email: u.email, isAdmin: !!u.isAdmin } });
    }

    if (path === '/api/auth/google' && method === 'POST') {
      var u = users.find(function(u) { return u.email === body.email; });
      if (!u) {
        u = { id: data.nextUserId++, name: body.name, email: body.email, googleId: body.googleId, isAdmin: 0, createdAt: new Date().toISOString() };
        users.push(u);
        await saveData(data);
      }
      var tk = jwt.sign({ id: u.id, email: u.email, name: u.name, isAdmin: u.isAdmin }, JWT_SECRET);
      return send(res, 200, { token: tk, user: { id: u.id, name: u.name, email: u.email, isAdmin: !!u.isAdmin } });
    }

    if (path === '/api/auth/me') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      var u = users.find(function(u) { return u.id === userData.id; });
      if (!u) return send(res, 404, { error: 'User not found' });
      return send(res, 200, { id: u.id, name: u.name, email: u.email, phone: u.phone, company: u.company, isAdmin: u.isAdmin });
    }

    // PRODUCTS
    if (path === '/api/products' && method === 'GET')
      return send(res, 200, products.slice().reverse());

    if (path === '/api/products/promotions' && method === 'GET')
      return send(res, 200, products.filter(function(p) { return p.is_promotion === 1; }).reverse());

    var catMatch = path.match(/^\/api\/products\/category\/(.+)$/);
    if (catMatch && method === 'GET') {
      var cat = decodeURIComponent(catMatch[1]);
      if (VALID_CATEGORIES.indexOf(cat) === -1) return send(res, 400, { error: 'Categoria invalida' });
      return send(res, 200, products.filter(function(p) { return p.category === cat; }).reverse());
    }

    var pidMatch = path.match(/^\/api\/products\/(\d+)$/);
    if (pidMatch && method === 'GET') {
      var p = products.find(function(p) { return p.id === parseInt(pidMatch[1]); });
      if (!p) return send(res, 404, { error: 'Produto nao encontrado' });
      return send(res, 200, p);
    }

    // ORDERS
    if (path === '/api/orders') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (method === 'POST') {
        var vals = { site: 450, app_mobile: 650, app_desktop: 1200 };
        var o = { id: data.nextOrderId++, userId: userData.id, type: body.type, description: body.description, name: body.name, phone: body.phone, company: body.company || '', deliveryTime: body.deliveryTime, features: JSON.stringify(body.features || []), value: vals[body.type] || 0, status: 'pending', createdAt: new Date().toISOString() };
        orders.push(o);
        await saveData(data);
        return send(res, 200, o);
      }
      if (method === 'GET') {
        var userOrders = orders.filter(function(o) { return o.userId === userData.id; }).sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        return send(res, 200, userOrders);
      }
    }

    // CHAT
    var chatMatch = path.match(/^\/api\/chat\/(\d+)$/);
    if (chatMatch && (method === 'GET' || method === 'POST')) {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      var oid = parseInt(chatMatch[1]);
      var order = orders.find(function(o) { return o.id === oid; });
      if (!order) return send(res, 404, { error: 'Pedido não encontrado' });
      if (order.userId !== userData.id && !userData.isAdmin) return send(res, 403, { error: 'Acesso negado' });
      if (method === 'POST') {
        messages.push({ id: data.nextMsgId++, orderId: oid, userId: userData.id, text: body.text, isAdmin: userData.isAdmin ? 1 : 0, createdAt: new Date().toISOString() });
        await saveData(data);
      }
      var msgs = messages.filter(function(m) { return m.orderId === oid; }).sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
      return send(res, 200, msgs);
    }

    // ADMIN
    if (path === '/api/admin/orders' && method === 'GET') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      var adminOrders = orders.slice().sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }).map(function(o) {
        var u = users.find(function(u) { return u.id === o.userId; });
        return Object.assign({}, o, { userName: u ? u.name : '', userEmail: u ? u.email : '', userPhone: u ? u.phone : '' });
      });
      return send(res, 200, adminOrders);
    }

    var statusMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/status$/);
    if (statusMatch && method === 'PUT') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      var order = orders.find(function(o) { return o.id === parseInt(statusMatch[1]); });
      if (!order) return send(res, 404, { error: 'Pedido nao encontrado' });
      order.status = body.status;
      await saveData(data);
      return send(res, 200, order);
    }

    if (path === '/api/admin/stats' && method === 'GET') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      return send(res, 200, { totalOrders: orders.length, totalRevenue: orders.filter(function(o) { return o.status !== 'cancelled'; }).reduce(function(s, o) { return s + o.value; }, 0), pendingOrders: orders.filter(function(o) { return o.status === 'pending'; }).length, completedOrders: orders.filter(function(o) { return o.status === 'completed'; }).length, inProgressOrders: orders.filter(function(o) { return o.status === 'in_progress'; }).length, ordersByMonth: [], ordersByType: [] });
    }

    if (path === '/api/test')
      return send(res, 200, { status: 'ok', products: products.length });

    return send(res, 404, { error: 'Rota não encontrada' });
  } catch (e) {
    return send(res, 500, { error: e.message || 'Erro interno' });
  }
};
