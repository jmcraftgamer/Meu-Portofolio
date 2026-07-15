import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

var JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-2024';

var supabase = null;
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  }
} catch (e) {}

var SEED_PRODUCTS = [
  { name: 'Arroz Branco Tipo 1 - 5kg', description: 'Arroz agulhinha tipo 1, graos selecionados', price: 24.90, promo_price: 19.90, category: 'Mercearia', image: '/images/arroz.png', is_promotion: 1, stock: 50 },
  { name: 'Feijao Carioca - 1kg', description: 'Feijao carioca tipo 1, embalagem 1kg', price: 7.50, promo_price: null, category: 'Mercearia', image: '/images/feijao.png', is_promotion: 0, stock: 80 },
  { name: 'Oleo de Soja - 900ml', description: 'Oleo de soja refinado, 900ml', price: 6.80, promo_price: 4.99, category: 'Mercearia', is_promotion: 1, stock: 100, image: '/images/oleo-soja.png' },
  { name: 'Acucar Cristal - 2kg', description: 'Acucar cristal refinado, pacote 2kg', price: 9.90, promo_price: null, category: 'Mercearia', is_promotion: 0, stock: 60, image: '/images/acucar.png' },
  { name: 'Cafe Torrado Mo - 500g', description: 'Cafe torrado moido premium, 500g', price: 15.90, promo_price: 12.90, category: 'Mercearia', is_promotion: 1, stock: 40, image: '/images/cafe.png' },
  { name: 'Macarrao Espaguete - 500g', description: 'Macarrao espaguete grano duro, 500g', price: 4.50, promo_price: null, category: 'Mercearia', is_promotion: 0, stock: 90, image: '/images/macarrao.png' },
  { name: 'Detergente Liquido - 500ml', description: 'Detergente liquido neutro, 500ml', price: 3.20, promo_price: 2.50, category: 'Limpeza', is_promotion: 1, stock: 120, image: '/images/detergente.png' },
  { name: 'Agua Sanitaria - 1L', description: 'Agua sanitaria para limpeza geral, 1L', price: 4.90, promo_price: null, category: 'Limpeza', is_promotion: 0, stock: 70, image: '/images/agua-sanitaria.png' },
  { name: 'Sabao em Po - 1kg', description: 'Sabao em po para lavar roupas, 1kg', price: 12.50, promo_price: 9.90, category: 'Limpeza', is_promotion: 1, stock: 45, image: '/images/sabao-po.png' },
  { name: 'Desinfetante - 500ml', description: 'Desinfetante perfumado, 500ml', price: 5.50, promo_price: null, category: 'Limpeza', is_promotion: 0, stock: 60, image: '/images/desinfetante.png' },
  { name: 'Shampoo - 350ml', description: 'Shampoo para todos os tipos de cabelo', price: 18.90, promo_price: 14.90, category: 'Higiene', is_promotion: 1, stock: 35, image: '/images/shampoo.png' },
  { name: 'Sabonete - 90g', description: 'Sabonete hidratante, 90g', price: 3.50, promo_price: 2.99, category: 'Higiene', is_promotion: 1, stock: 150, image: '/images/sabonete.png' },
  { name: 'Creme Dental - 90g', description: 'Creme dental com fluor, 90g', price: 6.90, promo_price: null, category: 'Higiene', is_promotion: 0, stock: 80, image: '/images/creme-dental.png' },
  { name: 'Papel Higienico - 4 rolos', description: 'Papel higienico folha dupla, 4 rolos', price: 8.90, promo_price: 6.90, category: 'Higiene', is_promotion: 1, stock: 100, image: '/images/papel-higienico.png' },
  { name: 'Biscoito Recheado - 140g', description: 'Biscoito recheado sabor chocolate', price: 3.80, promo_price: null, category: 'Biscoitos', is_promotion: 0, stock: 200, image: '/images/biscoito-recheado.png' },
  { name: 'Salgadinho de Milho - 80g', description: 'Salgadinho de milho sabor queijo', price: 4.50, promo_price: 3.50, category: 'Biscoitos', is_promotion: 1, stock: 120, image: '/images/salgadinho.png' },
  { name: 'Bolacha Agua e Sal - 200g', description: 'Bolacha agua e sal tradicional', price: 3.20, promo_price: null, category: 'Biscoitos', is_promotion: 0, stock: 90, image: '/images/bolacha-agua-sal.png' },
  { name: 'Biscoito Maizena - 200g', description: 'Biscoito maizena tradicional', price: 4.20, promo_price: 3.20, category: 'Biscoitos', is_promotion: 1, stock: 75, image: '/images/biscoito-maizena.png' },
  { name: 'Patinho Moido - 500g', description: 'Patinho moido fresco, bandeja 500g', price: 22.90, promo_price: 19.90, category: 'Acougue', is_promotion: 1, stock: 25, image: '/images/patinho-moido.png' },
  { name: 'Peito de Frango - 1kg', description: 'Peito de frango resfriado, 1kg', price: 16.90, promo_price: null, category: 'Acougue', is_promotion: 0, stock: 30, image: '/images/peito-frango.png' },
  { name: 'Costela Bovina - 1kg', description: 'Costela bovina para cozido, 1kg', price: 28.90, promo_price: 24.90, category: 'Acougue', is_promotion: 1, stock: 15, image: '/images/costela-bovina.png' },
  { name: 'Linguica Calabresa - 500g', description: 'Linguica calabresa defumada, 500g', price: 14.90, promo_price: null, category: 'Acougue', is_promotion: 0, stock: 40, image: '/images/linguica-calabresa.png' },
];

var VALID_CATEGORIES = ['Mercearia', 'Hortifruit', 'Acougue', 'Padaria', 'Bebidas', 'Biscoitos', 'Higiene', 'Limpeza', 'Utilidades', 'Outros'];

var products = SEED_PRODUCTS.map(function(p, i) { return { id: i + 1, ...p, created_at: new Date().toISOString() }; });

function getProductById(id) {
  return products.find(function(p) { return p.id === id; }) || SEED_PRODUCTS[id - 1] || null;
}

// In-memory fallback
var memUsers = [
  { id: 1, name: 'Administrador', email: 'admin@gmail.com', password: bcrypt.hashSync('45677VDTYT', 10), phone: '(11) 99999-0000', company: 'DevPro', isAdmin: true, createdAt: new Date().toISOString() },
  { id: 2, name: 'Admin Central', email: 'admin@central.com', password: bcrypt.hashSync('admin123', 10), phone: '(11) 99999-0001', company: 'Central', isAdmin: true, createdAt: new Date().toISOString() },
  { id: 3, name: 'Maria Cliente', email: 'maria@cliente.com', password: bcrypt.hashSync('cliente123', 10), phone: '(11) 98888-0000', company: '', isAdmin: false, createdAt: new Date().toISOString() }
];
var memOrders = [];
var memMessages = [];
var memNextUserId = 4;
var memNextOrderId = 1;

// Mercado-specific in-memory storage
var memMercadoOrders = [];
var memMercadoMessages = [];
var memMercadoNextOrderId = 1;

async function getMercadoOrders(userId, isAdmin) {
  if (supabase) {
    try {
      var q = supabase.from('mercado_orders').select('*');
      if (!isAdmin) q = q.eq('user_id', userId);
      q = q.order('created_at', { ascending: false });
      var r = await q;
      if (r.data) return r.data.map(function(o) {
        return { ...o, items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []) };
      });
    } catch (e) { console.error(e); }
  }
  return memMercadoOrders.filter(function(o) {
    return isAdmin || o.user_id === userId;
  }).sort(function(a, b) {
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

async function createMercadoOrder(userId, data) {
  var items = (data.items || []).map(function(item) {
    var product = getProductById(item.product_id);
    var price = product && product.is_promotion && product.promo_price ? product.promo_price : (product ? product.price : 0);
    return {
      product_id: item.product_id,
      product_name: product ? product.name : 'Produto #' + item.product_id,
      quantity: item.quantity,
      price: price
    };
  });
  var total = items.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
  var order = {
    id: memMercadoNextOrderId++, user_id: userId, items: items,
    delivery_name: data.delivery_name || '', address: data.address || '',
    phone: data.phone || '', troco: data.troco || '', notes: data.notes || '',
    total: total, status: 'pending',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  };
  memMercadoOrders.push(order);
  if (supabase) {
    try {
      var r = await supabase.from('mercado_orders').insert({
        user_id: userId, items: JSON.stringify(items),
        delivery_name: order.delivery_name, address: order.address,
        phone: order.phone, troco: order.troco, notes: order.notes,
        total: total, status: 'pending'
      }).select().maybeSingle();
      if (r.data) { order.id = r.data.id; order.created_at = r.data.created_at; }
    } catch (e) { console.error(e); }
  }
  return order;
}

async function updateMercadoOrderStatus(orderId, status) {
  if (supabase) {
    try {
      await supabase.from('mercado_orders').update({ status: status, updated_at: new Date().toISOString() }).eq('id', orderId);
    } catch (e) { console.error(e); }
  }
  var o = memMercadoOrders.find(function(o) { return o.id === parseInt(orderId); });
  if (o) o.status = status;
}

async function getMercadoMessages(orderId) {
  if (supabase) {
    try {
      var r = await supabase.from('mercado_messages').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
      if (r.data) return r.data;
    } catch (e) { console.error(e); }
  }
  return memMercadoMessages.filter(function(m) { return m.order_id === parseInt(orderId); }).sort(function(a, b) {
    return new Date(a.created_at) - new Date(b.created_at);
  });
}

async function createMercadoMessage(orderId, userId, text, senderRole) {
  var msg = {
    id: memMercadoMessages.length + 1, order_id: parseInt(orderId),
    user_id: userId, sender_role: senderRole || 'user',
    message: text, created_at: new Date().toISOString()
  };
  memMercadoMessages.push(msg);
  if (supabase) {
    try {
      var r = await supabase.from('mercado_messages').insert({
        order_id: parseInt(orderId), user_id: userId,
        sender_role: senderRole || 'user', message: text
      }).select().maybeSingle();
      if (r.data) { msg.id = r.data.id; msg.created_at = r.data.created_at; }
    } catch (e) { console.error(e); }
  }
  return msg;
}

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.end(JSON.stringify(data));
}

async function findUserByEmail(email) {
  if (supabase) {
    var r = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (r.data) return { id: r.data.id, name: r.data.name, email: r.data.email, password: r.data.password, phone: r.data.phone || '', company: r.data.company || '', isAdmin: !!r.data.is_admin, createdAt: r.data.created_at };
  }
  return memUsers.find(function(u) { return u.email === email; });
}

async function findUserById(id) {
  if (supabase) {
    var r = await supabase.from('users').select('*').eq('id', id).maybeSingle();
    if (r.data) return { id: r.data.id, name: r.data.name, email: r.data.email, password: r.data.password, phone: r.data.phone || '', company: r.data.company || '', isAdmin: !!r.data.is_admin, createdAt: r.data.created_at };
  }
  return memUsers.find(function(u) { return u.id === id; });
}

async function createUser(name, email, hashedPw, phone, company, isAdmin) {
  if (supabase) {
    var r = await supabase.from('users').insert({ name: name, email: email, password: hashedPw, phone: phone || '', company: company || '', is_admin: isAdmin }).select().maybeSingle();
    if (r.data) return { id: r.data.id, name: r.data.name, email: r.data.email, password: r.data.password, phone: r.data.phone || '', company: r.data.company || '', isAdmin: !!r.data.is_admin, createdAt: r.data.created_at };
  }
  var u = { id: memNextUserId++, name: name, email: email, password: hashedPw, phone: phone || '', company: company || '', isAdmin: isAdmin, createdAt: new Date().toISOString() };
  memUsers.push(u);
  return u;
}

async function getOrders(userId) {
  if (supabase) {
    var r = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (r.data) return r.data.map(function(o) { return { id: o.id, userId: o.user_id, type: o.type, description: o.description, name: o.name, phone: o.phone, company: o.company || '', deliveryTime: o.delivery_time, features: o.features, value: o.value, status: o.status, createdAt: o.created_at, delivered_at: o.delivered_at, delivery_confirmed_at: o.delivery_confirmed_at }; });
  }
  return memOrders.filter(function(o) { return o.userId === userId; }).sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
}

async function createOrder(userId, data) {
  var vals = { site: 700, app_mobile: 1100, app_desktop: 1500 };
  if (supabase) {
    var r = await supabase.from('orders').insert({ user_id: userId, type: data.type, description: data.description, name: data.name, phone: data.phone, company: data.company || '', delivery_time: data.deliveryTime, features: JSON.stringify(data.features || []), value: vals[data.type] || 0, status: 'pending' }).select().maybeSingle();
    if (r.data) return { id: r.data.id, userId: r.data.user_id, type: r.data.type, description: r.data.description, name: r.data.name, phone: r.data.phone, company: r.data.company || '', deliveryTime: r.data.delivery_time, features: r.data.features, value: r.data.value, status: r.data.status, createdAt: r.data.created_at, delivered_at: r.data.delivered_at, delivery_confirmed_at: r.data.delivery_confirmed_at };
  }
  var o = { id: memNextOrderId++, userId: userId, type: data.type, description: data.description, name: data.name, phone: data.phone, company: data.company || '', deliveryTime: data.deliveryTime, features: JSON.stringify(data.features || []), value: vals[data.type] || 0, status: 'pending', createdAt: new Date().toISOString(), delivered_at: null, delivery_confirmed_at: null };
  memOrders.push(o);
  return o;
}

async function getAllOrders() {
  if (supabase) {
    var r = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (r.data) return r.data.map(function(o) { return { id: o.id, userId: o.user_id, type: o.type, description: o.description, name: o.name, phone: o.phone, company: o.company || '', deliveryTime: o.delivery_time, features: o.features, value: o.value, status: o.status, createdAt: o.created_at, delivered_at: o.delivered_at, delivery_confirmed_at: o.delivery_confirmed_at }; });
  }
  return memOrders.slice().sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
}

async function findOrderById(id) {
  if (supabase) {
    var r = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
    if (r.data) return { id: r.data.id, userId: r.data.user_id, type: r.data.type, description: r.data.description, name: r.data.name, phone: r.data.phone, company: r.data.company || '', deliveryTime: r.data.delivery_time, features: r.data.features, value: r.data.value, status: r.data.status, createdAt: r.data.created_at, delivered_at: r.data.delivered_at, delivery_confirmed_at: r.data.delivery_confirmed_at };
  }
  return memOrders.find(function(o) { return o.id === id; });
}

async function updateOrderStatus(id, status) {
  if (supabase) {
    await supabase.from('orders').update({ status: status }).eq('id', id);
  }
  var o = memOrders.find(function(o) { return o.id === id; });
  if (o) o.status = status;
}

async function deliverOrder(id, userId) {
  var now = new Date().toISOString();
  if (supabase) {
    await supabase.from('orders').update({ delivered_at: now, status: 'completed' }).eq('id', id);
  }
  var o = memOrders.find(function(o) { return o.id === id; });
  if (o) { o.delivered_at = now; o.status = 'completed'; }
  return o;
}

async function confirmDelivery(id, userId) {
  var now = new Date().toISOString();
  if (supabase) {
    await supabase.from('orders').update({ delivery_confirmed_at: now }).eq('id', id).eq('user_id', userId);
  }
  var o = memOrders.find(function(o) { return o.id === id && o.userId === userId; });
  if (o) o.delivery_confirmed_at = now;
  return o;
}

function mapMessage(m) {
  return { id: m.id, orderId: m.order_id, userId: m.user_id, text: m.text, isAdmin: !!m.is_admin, createdAt: m.created_at, type: m.type || 'text', file_data: m.file_data || null, file_type: m.file_type || null };
}

async function getMessages(orderId) {
  if (supabase) {
    var r = await supabase.from('messages').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
    if (r.data) return r.data.map(mapMessage);
  }
  return memMessages.filter(function(m) { return m.orderId === orderId; }).sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
}

async function createMessage(orderId, userId, text, isAdmin) {
  var msgData = { order_id: orderId, user_id: userId, text: text, is_admin: isAdmin };
  // Support file attachments from body if passed via extra params
  var args = arguments;
  var msgType = args[4] || 'text';
  var fileData = args[5] || null;
  var fileType = args[6] || null;
  if (msgType !== 'text') {
    msgData.type = msgType;
    msgData.file_data = fileData;
    msgData.file_type = fileType;
  }
  if (supabase) {
    var r = await supabase.from('messages').insert(msgData).select().maybeSingle();
    if (r.data) return mapMessage(r.data);
  }
  var id = memMessages.length + 1;
  var m = { id: id, orderId: orderId, userId: userId, text: text, isAdmin: isAdmin ? 1 : 0, createdAt: new Date().toISOString(), type: msgType, file_data: fileData, file_type: fileType };
  memMessages.push(m);
  return m;
}

function computeStats(allOrders) {
  var totalOrders = allOrders.length;
  var deliveredOrders = allOrders.filter(function(o) { return o.delivered_at || o.status === 'delivered'; }).length;
  var pendingOrders = allOrders.filter(function(o) { return o.status === 'pending'; }).length;

  var deliveredRevenue = allOrders.filter(function(o) { return o.delivered_at || o.status === 'delivered'; }).reduce(function(s, o) { return s + (o.value || 0); }, 0);

  var monthMap = {};
  var typeMap = {};
  var hourMap = {};
  allOrders.forEach(function(o) {
    var m = o.createdAt ? o.createdAt.substring(0, 7) : 'unknown';
    monthMap[m] = (monthMap[m] || 0) + 1;
    var t = o.type || 'other';
    typeMap[t] = (typeMap[t] || 0) + 1;
    if (o.createdAt) {
      var h = new Date(o.createdAt).getHours();
      var hourKey = h + ':00';
      hourMap[hourKey] = (hourMap[hourKey] || 0) + 1;
    }
  });

  var now = new Date();
  var currentMonth = now.toISOString().substring(0, 7);
  var ordersThisMonth = allOrders.filter(function(o) { return o.createdAt && o.createdAt.substring(0, 7) === currentMonth; }).length;

  var ordersByMonth = Object.keys(monthMap).sort().map(function(m) {
    return { month: m, count: monthMap[m] };
  });
  var ordersByType = Object.keys(typeMap).map(function(t) {
    return { type: t, count: typeMap[t] };
  });
  var ordersByHour = Object.keys(hourMap).sort().map(function(h) {
    return { hour: h, count: hourMap[h] };
  });

  var bestMonth = ordersByMonth.length > 0 ? ordersByMonth.reduce(function(a, b) { return a.count > b.count ? a : b; }) : null;

  var revenueByType = { site: 0, app_mobile: 0, app_desktop: 0 };
  allOrders.filter(function(o) { return o.status !== 'cancelled'; }).forEach(function(o) {
    if (revenueByType[o.type] !== undefined) revenueByType[o.type] += o.value || 0;
  });

  var monthlyRevenueMap = {};
  allOrders.filter(function(o) { return o.status !== 'cancelled'; }).forEach(function(o) {
    var m = o.createdAt ? o.createdAt.substring(0, 7) : 'unknown';
    monthlyRevenueMap[m] = (monthlyRevenueMap[m] || 0) + (o.value || 0);
  });
  var revenueByMonth = Object.keys(monthlyRevenueMap).sort().map(function(m) {
    return { month: m, revenue: monthlyRevenueMap[m] };
  });

  return {
    totalOrders: totalOrders,
    deliveredOrders: deliveredOrders,
    pendingOrders: pendingOrders,
    deliveredRevenue: deliveredRevenue,
    totalRevenue: allOrders.filter(function(o) { return o.status !== 'cancelled'; }).reduce(function(s, o) { return s + (o.value || 0); }, 0),
    ordersThisMonth: ordersThisMonth,
    bestMonth: bestMonth,
    ordersByMonth: ordersByMonth,
    ordersByType: ordersByType,
    ordersByHour: ordersByHour,
    revenueByType: revenueByType,
    revenueByMonth: revenueByMonth
  };
}

async function getAdminStats() {
  var allUsers = [];
  if (supabase) {
    try {
      var uRes = await supabase.from('users').select('*');
      if (uRes.data) allUsers = uRes.data;
    } catch (e) {}
  }
  var userMap = {};
  allUsers.forEach(function(u) { userMap[u.id] = u.name || u.email; });
  memUsers.forEach(function(u) { userMap[u.id] = u.name || u.email; });

  if (supabase) {
    try {
      var r = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (r.data) {
        var mapped = r.data.map(function(o) {
          return { id: o.id, userId: o.user_id, type: o.type, value: o.value, status: o.status, createdAt: o.created_at, name: o.name, phone: o.phone, company: o.company || '', description: o.description, deliveryTime: o.delivery_time, delivered_at: o.delivered_at, delivery_confirmed_at: o.delivery_confirmed_at, userName: userMap[o.user_id] || '' };
        });
        var stats = computeStats(mapped);
        stats.orders = mapped;
        return stats;
      }
    } catch (e) { console.error(e); }
  }
  var memOrdersWithUser = memOrders.map(function(o) {
    return Object.assign({}, o, { userName: userMap[o.userId] || '' });
  });
  var stats = computeStats(memOrdersWithUser);
  stats.orders = memOrdersWithUser;
  return stats;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.end();
  }

  try {
    var url = new URL(req.url, 'http://localhost');
    var path = url.searchParams.get('__path') || url.pathname;
    var method = req.method;
    var body = method !== 'GET' ? await parseBody(req) : {};

    // AUTH
    function userResponse(u) {
      return { id: u.id, name: u.name, email: u.email, isAdmin: !!u.isAdmin, role: u.isAdmin ? 'admin' : 'user' };
    }

    if (path === '/api/auth/register' && method === 'POST') {
      var existing = await findUserByEmail(body.email);
      if (existing) return send(res, 400, { error: 'Email já cadastrado' });
      var hp = bcrypt.hashSync(body.password, 10);
      var adminEmails = ['admin@gmail.com', 'admin@central.com'];
      var isAdm = adminEmails.indexOf((body.email || '').toLowerCase()) !== -1;
      var u = await createUser(body.name, body.email, hp, body.phone, body.company, isAdm);
      var tk = jwt.sign({ id: u.id, email: u.email, name: u.name, isAdmin: u.isAdmin }, JWT_SECRET);
      return send(res, 200, { token: tk, user: userResponse(u) });
    }

    if (path === '/api/auth/login' && method === 'POST') {
      var u = await findUserByEmail(body.email);
      if (!u || !u.password) return send(res, 400, { error: 'Credenciais inválidas' });
      if (!bcrypt.compareSync(body.password, u.password)) return send(res, 400, { error: 'Credenciais inválidas' });
      var tk = jwt.sign({ id: u.id, email: u.email, name: u.name, isAdmin: !!u.isAdmin }, JWT_SECRET);
      return send(res, 200, { token: tk, user: userResponse(u) });
    }

    if (path === '/api/auth/google' && method === 'POST') {
      var u = await findUserByEmail(body.email);
      if (!u) {
        u = await createUser(body.name, body.email, null, '', '', false);
      }
      var tk = jwt.sign({ id: u.id, email: u.email, name: u.name, isAdmin: !!u.isAdmin }, JWT_SECRET);
      return send(res, 200, { token: tk, user: userResponse(u) });
    }

    if (path === '/api/auth/me') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      var u = await findUserById(userData.id);
      if (!u) return send(res, 404, { error: 'User not found' });
      var ur = userResponse(u);
      return send(res, 200, { ...ur, user: ur });
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

    // MERCADO ORDERS
    if (path === '/api/mercado/orders') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (method === 'POST') {
        var mo = await createMercadoOrder(userData.id, body);
        return send(res, 201, mo);
      }
      if (method === 'GET') {
        var mercadoOrders = await getMercadoOrders(userData.id, !!userData.isAdmin);
        return send(res, 200, mercadoOrders);
      }
    }

    // MERCADO CHAT
    var mercadoMsgMatch = path.match(/^\/api\/mercado\/orders\/(\d+)\/messages$/);
    if (mercadoMsgMatch && (method === 'GET' || method === 'POST')) {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      var oid = parseInt(mercadoMsgMatch[1]);
      var mOrders = await getMercadoOrders(userData.id, !!userData.isAdmin);
      var mOrder = mOrders.find(function(o) { return o.id === oid; });
      if (!mOrder) return send(res, 404, { error: 'Pedido nao encontrado' });
      if (mOrder.user_id !== userData.id && !userData.isAdmin) return send(res, 403, { error: 'Acesso negado' });
      if (method === 'POST') {
        var newMsg = await createMercadoMessage(oid, userData.id, body.message || body.text || '', userData.isAdmin ? 'admin' : 'user');
        return send(res, 201, newMsg);
      }
      var msgs = await getMercadoMessages(oid);
      return send(res, 200, msgs);
    }

    // MERCADO ADMIN
    if (path === '/api/mercado/admin/orders' && method === 'GET') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      var allMercadoOrders = await getMercadoOrders(null, true);
      return send(res, 200, allMercadoOrders);
    }

    var mStatusMatch = path.match(/^\/api\/mercado\/admin\/orders\/(\d+)\/status$/);
    if (mStatusMatch && method === 'PUT') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      await updateMercadoOrderStatus(parseInt(mStatusMatch[1]), body.status);
      var updatedOrders = await getMercadoOrders(null, true);
      var updatedOrder = updatedOrders.find(function(o) { return o.id === parseInt(mStatusMatch[1]); });
      if (!updatedOrder) return send(res, 404, { error: 'Pedido nao encontrado' });
      return send(res, 200, updatedOrder);
    }

    // ORDERS (portfolio)
    if (path === '/api/orders') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (method === 'POST') {
        var o = await createOrder(userData.id, body);
        return send(res, 200, o);
      }
      if (method === 'GET') {
        var userOrders = await getOrders(userData.id);
        return send(res, 200, userOrders);
      }
    }

    // CHAT (portfolio)
    var chatMatch = path.match(/^\/api\/chat\/(\d+)$/);
    if (chatMatch && (method === 'GET' || method === 'POST')) {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      var oid = parseInt(chatMatch[1]);
      var order = await findOrderById(oid);
      if (!order) return send(res, 404, { error: 'Pedido não encontrado' });
      if (order.userId !== userData.id && !userData.isAdmin) return send(res, 403, { error: 'Acesso negado' });
      if (method === 'POST') {
        await createMessage(oid, userData.id, body.text, !!userData.isAdmin, body.type || 'text', body.file_data || null, body.file_type || null);
      }
      var msgs = await getMessages(oid);
      return send(res, 200, msgs);
    }

    // ADMIN (portfolio)
    if (path === '/api/admin/orders' && method === 'GET') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      var allOrders = await getAllOrders();
      var enriched = [];
      for (var i = 0; i < allOrders.length; i++) {
        var u = await findUserById(allOrders[i].userId);
        enriched.push(Object.assign({}, allOrders[i], { userName: u ? u.name : '', userEmail: u ? u.email : '', userPhone: u ? u.phone : '' }));
      }
      return send(res, 200, enriched);
    }

    var statusMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/status$/);
    if (statusMatch && method === 'PUT') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      var order = await findOrderById(parseInt(statusMatch[1]));
      if (!order) return send(res, 404, { error: 'Pedido nao encontrado' });
      await updateOrderStatus(order.id, body.status);
      return send(res, 200, Object.assign({}, order, { status: body.status }));
    }

    var deliverMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/deliver$/);
    if (deliverMatch && method === 'PUT') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      var delivered = await deliverOrder(parseInt(deliverMatch[1]), userData.id);
      if (!delivered) return send(res, 404, { error: 'Pedido nao encontrado' });
      var fullOrder = await findOrderById(delivered.id);
      return send(res, 200, fullOrder);
    }

    var confirmMatch = path.match(/^\/api\/orders\/(\d+)\/confirm-delivery$/);
    if (confirmMatch && method === 'PUT') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      var confirmed = await confirmDelivery(parseInt(confirmMatch[1]), userData.id);
      if (!confirmed) return send(res, 404, { error: 'Pedido nao encontrado' });
      var fullOrder = await findOrderById(confirmed.id);
      return send(res, 200, fullOrder);
    }

    if (path === '/api/admin/stats' && method === 'GET') {
      var userData = auth(req);
      if (!userData) return send(res, 401, { error: 'Token required' });
      if (!userData.isAdmin) return send(res, 403, { error: 'Admin only' });
      var stats = await getAdminStats();
      return send(res, 200, stats);
    }

    if (path === '/api/test')
      return send(res, 200, { status: 'ok', products: products.length });

    return send(res, 404, { error: 'Rota não encontrada' });
  } catch (e) {
    return send(res, 500, { error: e.message || 'Erro interno' });
  }
};
