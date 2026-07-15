import { initDatabase, getDatabase, prepare, saveDatabase } from './connection';
import bcrypt from 'bcryptjs';

async function seed(): Promise<void> {
  await initDatabase();

  const existingAdmin = prepare('SELECT id FROM users WHERE email = ?').get('admin@central.com');
  if (!existingAdmin) {
    const hash = bcrypt.hashSync('admin123', 10);
    prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Administrador', 'admin@central.com', hash, 'admin'
    );
  }

  const existingUser = prepare('SELECT id FROM users WHERE email = ?').get('user@teste.com');
  if (!existingUser) {
    const hash = bcrypt.hashSync('user123', 10);
    prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Cliente Teste', 'user@teste.com', hash, 'user'
    );
  }

  const products = prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (products.count === 0) {
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

    const stmt = prepare(
      'INSERT INTO products (name, description, price, promo_price, category, image, is_promotion, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    for (const item of items) {
      stmt.run(item.name, item.description, item.price, item.promo_price, item.category, item.image, item.is_promotion, item.stock);
    }

    console.log('[Seed] 22 produtos inseridos com sucesso.');
  }

  saveDatabase();
  console.log('[Seed] Banco de dados populado com sucesso!');
  console.log('  Admin: admin@central.com / admin123');
  console.log('  User:  user@teste.com / user123');
}

seed().catch(console.error);
