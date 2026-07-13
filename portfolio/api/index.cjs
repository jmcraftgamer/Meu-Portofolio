const products = [
  { id: 1, name: 'Arroz Branco Tipo 1 - 5kg', description: 'Arroz agulhinha tipo 1, graos selecionados', price: 24.90, promo_price: 19.90, category: 'Mercearia', image: '/images/arroz.png', is_promotion: 1, stock: 50 },
  { id: 2, name: 'Feijao Carioca - 1kg', description: 'Feijao carioca tipo 1, embalagem 1kg', price: 7.50, promo_price: null, category: 'Mercearia', image: '/images/feijao.png', is_promotion: 0, stock: 80 },
  { id: 3, name: 'Oleo de Soja - 900ml', description: 'Oleo de soja refinado, 900ml', price: 6.80, promo_price: 4.99, category: 'Mercearia', image: '/images/oleo-soja.png', is_promotion: 1, stock: 100 },
  { id: 4, name: 'Acucar Cristal - 2kg', description: 'Acucar cristal refinado, pacote 2kg', price: 9.90, promo_price: null, category: 'Mercearia', image: '/images/acucar.png', is_promotion: 0, stock: 60 },
];

const users = [{ id: 1, name: 'Administrador', email: 'admin@gmail.com', password: '$2a$10$dummy', isAdmin: 1 }];
let nextId = 5;

module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  if (path === '/api/products' && req.method === 'GET') {
    return res.end(JSON.stringify(products));
  }

  if (path === '/api/test') {
    return res.end(JSON.stringify({ status: 'ok', count: products.length, users: users.length }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'not found' }));
};
