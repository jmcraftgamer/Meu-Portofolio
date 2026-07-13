import { Router, Request, Response } from 'express';
import { prepare } from '../database/connection';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const products = prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

router.get('/promotions', (_req: Request, res: Response) => {
  const products = prepare('SELECT * FROM products WHERE is_promotion = 1 ORDER BY created_at DESC').all();
  res.json(products);
});

router.get('/category/:category', (req: Request, res: Response) => {
  const { category } = req.params;
  const validCategories = ['Limpeza', 'Higiene', 'Mercearia', 'Biscoitos', 'Acougue'];
  if (!validCategories.includes(category)) {
    res.status(400).json({ error: 'Categoria invalida' });
    return;
  }
  const products = prepare('SELECT * FROM products WHERE category = ? ORDER BY created_at DESC').all(category);
  res.json(products);
});

router.get('/:id', (req: Request, res: Response) => {
  const product = prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Produto nao encontrado' });
    return;
  }
  res.json(product);
});

router.post('/', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { name, description, price, promo_price, category, image, is_promotion, stock } = req.body;
  if (!name || !price || !category) {
    res.status(400).json({ error: 'Nome, preco e categoria sao obrigatorios' });
    return;
  }

  const result = prepare(
    'INSERT INTO products (name, description, price, promo_price, category, image, is_promotion, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, description || '', price, promo_price || null, category, image || '', is_promotion ? 1 : 0, stock || 0);

  const product = prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(product);
});

router.put('/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const existing = prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Produto nao encontrado' });
    return;
  }

  const { name, description, price, promo_price, category, image, is_promotion, stock } = req.body;

  const current = existing as any;
  const finalName = name ?? current.name;
  const finalDesc = description !== undefined ? description : current.description;
  const finalPrice = price ?? current.price;
  const finalPromo = promo_price !== undefined ? promo_price : current.promo_price;
  const finalCat = category ?? current.category;
  const finalImage = image !== undefined ? image : current.image;
  const finalPromoFlag = is_promotion !== undefined ? (is_promotion ? 1 : 0) : current.is_promotion;
  const finalStock = stock !== undefined ? stock : current.stock;

  prepare(`
    UPDATE products SET name=?, description=?, price=?, promo_price=?, category=?, image=?, is_promotion=?, stock=? WHERE id=?
  `).run(finalName, finalDesc, finalPrice, finalPromo, finalCat, finalImage, finalPromoFlag, finalStock, req.params.id);

  const updated = prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.delete('/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const existing = prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Produto nao encontrado' });
    return;
  }
  prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Produto removido com sucesso' });
});

export default router;
