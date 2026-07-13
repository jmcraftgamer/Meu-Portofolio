import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'portfolio-secret-key-2024';

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3001'], credentials: true }));
app.use(express.json());

const ROOT = path.join(__dirname, '../..');
const DB_PATH = path.join(__dirname, '../data/portfolio.db');

function wrapApp(html: string, name: string): string {
  const backBtn = `
    <div style="position:fixed;top:0;left:0;right:0;z-index:99999;
      background:rgba(10,10,10,0.95);backdrop-filter:blur(12px);
      border-bottom:1px solid rgba(255,215,0,0.15);
      display:flex;align-items:center;justify-content:space-between;
      padding:8px 16px;height:48px;font-family:'Inter',system-ui,sans-serif;">
      <a href="http://localhost:5173/testar" target="_top"
        style="display:flex;align-items:center;gap:8px;color:#FFD700;
          text-decoration:none;font-size:13px;font-weight:600;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        Voltar
      </a>
      <span style="color:#888;font-size:12px;">Testando: ${name}</span>
      <span style="width:60px;"></span>
    </div>
    <style>body{padding-top:48px!important;}</style>
  `;
  return html.replace('</body>', backBtn + '\n</body>');
}

app.use('/apps/acai', (req, res, next) => {
  const filePath = path.join(ROOT, 'Açai Loja', req.path === '/' ? 'index.html' : req.path);
  if (req.path.endsWith('.html') || req.path === '/' || req.path === '') {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      content = wrapApp(content, 'Açaí Express');
      res.setHeader('Content-Type', 'text/html');
      return res.send(content);
    }
  }
  express.static(path.join(ROOT, 'Açai Loja'))(req, res, next);
});

app.use('/apps/hamburguer', (req, res, next) => {
  const filePath = path.join(ROOT, 'Humburguer', req.path === '/' ? 'index.html' : req.path);
  if (req.path.endsWith('.html') || req.path === '/' || req.path === '') {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      content = wrapApp(content, 'Hamburgueria Pro');
      res.setHeader('Content-Type', 'text/html');
      return res.send(content);
    }
  }
  express.static(path.join(ROOT, 'Humburguer'))(req, res, next);
});

app.use('/images', express.static(path.join(ROOT, 'Mercado App/server/public/images')));

app.use('/apps/mercado/web', (req, res, next) => {
  const filePath = path.join(ROOT, 'Mercado App/web/dist', req.path === '/' ? 'index.html' : req.path);
  const ext = path.extname(req.path);
  if (!ext || ext === '.html' || req.path === '/' || req.path === '') {
    const indexPath = path.join(ROOT, 'Mercado App/web/dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf-8');
      content = wrapApp(content, 'Mercado Digital');
      res.setHeader('Content-Type', 'text/html');
      return res.send(content);
    }
  }
  express.static(path.join(ROOT, 'Mercado App/web/dist'))(req, res, next);
});

function dbRun(db: any, sql: string, params: any[] = []) { db.run(sql, params); }

function dbGet(db: any, sql: string, params: any[] = []) {
  const stmt = db.prepare(sql); stmt.bind(params);
  if (stmt.step()) { const row = stmt.getAsObject(); stmt.free(); return row; }
  stmt.free(); return null;
}

function dbAll(db: any, sql: string, params: any[] = []) {
  const stmt = db.prepare(sql); stmt.bind(params);
  const rows: any[] = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free(); return rows;
}

async function initDb() {
  const SQL = await initSqlJs();
  let db: any;
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT, googleId TEXT, phone TEXT, company TEXT, isAdmin INTEGER DEFAULT 0, createdAt TEXT DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, type TEXT NOT NULL, description TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, company TEXT, deliveryTime TEXT NOT NULL, features TEXT, status TEXT DEFAULT 'pending', createdAt TEXT DEFAULT (datetime('now')), FOREIGN KEY (userId) REFERENCES users(id));
    CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, orderId INTEGER NOT NULL, userId INTEGER NOT NULL, text TEXT NOT NULL, isAdmin INTEGER DEFAULT 0, createdAt TEXT DEFAULT (datetime('now')), FOREIGN KEY (orderId) REFERENCES orders(id), FOREIGN KEY (userId) REFERENCES users(id));
    CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, promo_price REAL, category TEXT NOT NULL, image TEXT, is_promotion INTEGER DEFAULT 0, stock INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')));
  `);
  const existingProducts = dbGet(db, 'SELECT COUNT(*) as count FROM products') as any;
  if (existingProducts.count === 0) {
    const items = [
      { name: 'Arroz Branco Tipo 1 - 5kg', description: 'Arroz agulhinha tipo 1, graos selecionados', price: 24.90, promo_price: 19.90, category: 'Mercearia', is_promotion: 1, stock: 50, image: '/images/arroz.png' },
      { name: 'Feijao Carioca - 1kg', description: 'Feijao carioca tipo 1, embalagem 1kg', price: 7.50, promo_price: null, category: 'Mercearia', is_promotion: 0, stock: 80, image: '/images/feijao.png' },
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
    const stmt = db.prepare('INSERT INTO products (name, description, price, promo_price, category, image, is_promotion, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const item of items) { stmt.run([item.name, item.description, item.price, item.promo_price, item.category, item.image, item.is_promotion, item.stock]); }
    stmt.free();
    console.log('[Seed] 22 produtos inseridos.');
  }
  const existingAdmin = dbGet(db, 'SELECT id FROM users WHERE email = ?', ['admin@gmail.com']);
  if (!existingAdmin) {
    const adminHash = bcrypt.hashSync('45677VDTYT', 10);
    dbRun(db, 'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', ['Administrador', 'admin@gmail.com', adminHash, 1]);
    console.log('[Seed] Admin criado: admin@gmail.com / 45677VDTYT');
  }
  const buf = db.export(); fs.writeFileSync(DB_PATH, Buffer.from(buf));
  return db;
}

function saveDb(db: any) { const buf = db.export(); fs.writeFileSync(DB_PATH, Buffer.from(buf)); }

function auth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
}

function adminAuth(req: any, res: any, next: any) {
  auth(req, res, () => { if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' }); next(); });
}

async function start() {
  const db = await initDb();

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone, company } = req.body;
    try {
      const existing = dbGet(db, 'SELECT id FROM users WHERE email = ?', [email]);
      if (existing) return res.status(400).json({ error: 'Email já cadastrado' });
      const hashedPassword = bcrypt.hashSync(password, 10);
      const isAdmin = email.toLowerCase() === 'admin@gmail.com' ? 1 : 0;
      dbRun(db, 'INSERT INTO users (name, email, password, phone, company, isAdmin) VALUES (?, ?, ?, ?, ?, ?)', [name, email, hashedPassword, phone || '', company || '', isAdmin]);
      saveDb(db);
      const user = dbGet(db, 'SELECT * FROM users WHERE email = ?', [email]) as any;
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = dbGet(db, 'SELECT * FROM users WHERE email = ?', [email]) as any;
    if (!user || !user.password) return res.status(400).json({ error: 'Credenciais inválidas' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
  });

  app.post('/api/auth/google', (req, res) => {
    const { email, name, googleId } = req.body;
    try {
      let user = dbGet(db, 'SELECT * FROM users WHERE email = ?', [email]) as any;
      if (!user) {
      const isAdmin = email.toLowerCase() === 'admin@gmail.com' ? 1 : 0;
        dbRun(db, 'INSERT INTO users (name, email, googleId, isAdmin) VALUES (?, ?, ?, ?)', [name, email, googleId, isAdmin]);
        saveDb(db);
        user = dbGet(db, 'SELECT * FROM users WHERE email = ?', [email]) as any;
      }
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.get('/api/auth/me', auth, (req: any, res) => {
    const user = dbGet(db, 'SELECT id, name, email, phone, company, isAdmin FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  });

  app.post('/api/orders', auth, (req: any, res) => {
    const { type, description, name, phone, company, deliveryTime, features } = req.body;
    dbRun(db, 'INSERT INTO orders (userId, type, description, name, phone, company, deliveryTime, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.user.id, type, description, name, phone, company || '', deliveryTime, JSON.stringify(features || [])]);
    saveDb(db);
    const orders = dbAll(db, 'SELECT * FROM orders WHERE userId = ? ORDER BY id DESC LIMIT 1', [req.user.id]);
    res.json(orders[0]);
  });

  app.get('/api/orders', auth, (req: any, res) => {
    const orders = dbAll(db, 'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
    res.json(orders);
  });

  app.get('/api/orders/:id', auth, (req: any, res) => {
    const order = dbGet(db, 'SELECT * FROM orders WHERE id = ?', [Number(req.params.id)]);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  });

  app.get('/api/admin/orders', adminAuth, (req: any, res) => {
    const orders = dbAll(db, 'SELECT o.*, u.name as userName, u.email as userEmail, u.phone as userPhone FROM orders o JOIN users u ON o.userId = u.id ORDER BY o.createdAt DESC');
    res.json(orders);
  });

  app.put('/api/admin/orders/:id/status', adminAuth, (req: any, res) => {
    const { status } = req.body;
    dbRun(db, 'UPDATE orders SET status = ? WHERE id = ?', [status, Number(req.params.id)]);
    saveDb(db);
    const order = dbGet(db, 'SELECT * FROM orders WHERE id = ?', [Number(req.params.id)]);
    res.json(order);
  });

  app.get('/api/admin/stats', adminAuth, (req: any, res) => {
    const totalOrders = (dbGet(db, 'SELECT COUNT(*) as count FROM orders') as any).count;
    const pendingOrders = (dbGet(db, 'SELECT COUNT(*) as count FROM orders WHERE status = ?', ['pending']) as any).count;
    const completedOrders = (dbGet(db, 'SELECT COUNT(*) as count FROM orders WHERE status = ?', ['completed']) as any).count;
    const inProgressOrders = (dbGet(db, 'SELECT COUNT(*) as count FROM orders WHERE status = ?', ['in_progress']) as any).count;
    const ordersByMonth = dbAll(db, "SELECT strftime('%m', createdAt) as month, COUNT(*) as count FROM orders GROUP BY strftime('%m', createdAt) ORDER BY month");
    const ordersByType = dbAll(db, 'SELECT type, COUNT(*) as count FROM orders GROUP BY type');
    res.json({ totalOrders, pendingOrders, completedOrders, inProgressOrders, ordersByMonth, ordersByType });
  });

  const validCategories = ['Mercearia', 'Hortifruit', 'Acougue', 'Padaria', 'Bebidas', 'Biscoitos', 'Higiene', 'Limpeza', 'Utilidades', 'Outros'];

  app.get('/api/products', (_req: any, res) => {
    const products = dbAll(db, 'SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  });

  app.get('/api/products/promotions', (_req: any, res) => {
    const products = dbAll(db, 'SELECT * FROM products WHERE is_promotion = 1 ORDER BY created_at DESC');
    res.json(products);
  });

  app.get('/api/products/category/:category', (req: any, res) => {
    const { category } = req.params;
    if (!validCategories.includes(category)) { return res.status(400).json({ error: 'Categoria invalida' }); }
    const products = dbAll(db, 'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC', [category]);
    res.json(products);
  });

  app.get('/api/products/:id', (req: any, res) => {
    const product = dbGet(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);
    if (!product) return res.status(404).json({ error: 'Produto nao encontrado' });
    res.json(product);
  });

  app.post('/api/products', adminAuth, (req: any, res) => {
    const { name, description, price, promo_price, category, image, is_promotion, stock } = req.body;
    if (!name || !price || !category) return res.status(400).json({ error: 'Nome, preco e categoria sao obrigatorios' });
    dbRun(db, 'INSERT INTO products (name, description, price, promo_price, category, image, is_promotion, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description || '', price, promo_price || null, category, image || '', is_promotion ? 1 : 0, stock || 0]);
    saveDb(db);
    const product = dbGet(db, 'SELECT * FROM products WHERE id = ?', [(db as any).exec("SELECT MAX(id) as id FROM products")[0].values[0][0]]);
    res.status(201).json(product);
  });

  app.put('/api/products/:id', adminAuth, (req: any, res) => {
    const existing = dbGet(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);
    if (!existing) return res.status(404).json({ error: 'Produto nao encontrado' });
    const c = existing as any;
    const { name, description, price, promo_price, category, image, is_promotion, stock } = req.body;
    dbRun(db, 'UPDATE products SET name=?, description=?, price=?, promo_price=?, category=?, image=?, is_promotion=?, stock=? WHERE id=?',
      [name ?? c.name, description !== undefined ? description : c.description, price ?? c.price,
       promo_price !== undefined ? promo_price : c.promo_price, category ?? c.category,
       image !== undefined ? image : c.image, is_promotion !== undefined ? (is_promotion ? 1 : 0) : c.is_promotion,
       stock !== undefined ? stock : c.stock, Number(req.params.id)]);
    saveDb(db);
    const updated = dbGet(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);
    res.json(updated);
  });

  app.delete('/api/products/:id', adminAuth, (req: any, res) => {
    const existing = dbGet(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);
    if (!existing) return res.status(404).json({ error: 'Produto nao encontrado' });
    dbRun(db, 'DELETE FROM products WHERE id = ?', [Number(req.params.id)]);
    saveDb(db);
    res.json({ message: 'Produto removido com sucesso' });
  });

  app.get('/api/chat/:orderId', auth, (req: any, res) => {
    const order = dbGet(db, 'SELECT * FROM orders WHERE id = ?', [Number(req.params.id)]) as any;
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    if (order.userId !== req.user.id && !req.user.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
    const messages = dbAll(db, 'SELECT * FROM messages WHERE orderId = ? ORDER BY createdAt ASC', [Number(req.params.id)]);
    res.json(messages);
  });

  app.post('/api/chat/:orderId', auth, (req: any, res) => {
    const { text } = req.body;
    const order = dbGet(db, 'SELECT * FROM orders WHERE id = ?', [Number(req.params.id)]) as any;
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    if (order.userId !== req.user.id && !req.user.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
    const isAdmin = req.user.isAdmin ? 1 : 0;
    dbRun(db, 'INSERT INTO messages (orderId, userId, text, isAdmin) VALUES (?, ?, ?, ?)', [Number(req.params.id), req.user.id, text, isAdmin]);
    saveDb(db);
    const messages = dbAll(db, 'SELECT * FROM messages WHERE orderId = ? ORDER BY createdAt ASC', [Number(req.params.id)]);
    res.json(messages);
  });

  app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`); });
}

start().catch(console.error);
