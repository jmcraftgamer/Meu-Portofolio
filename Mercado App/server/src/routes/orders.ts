import { Router, Response } from 'express';
import { prepare, saveDatabase } from '../database/connection';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req: AuthRequest, res: Response) => {
  let orders: any[];
  if (req.user!.role === 'admin') {
    orders = prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  } else {
    orders = prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id);
  }

  const result = orders.map((order: any) => ({
    ...order,
    items: prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id),
  }));

  res.json(result);
});

router.get('/:id', authenticate, (req: AuthRequest, res: Response) => {
  const order = prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
  if (!order) {
    res.status(404).json({ error: 'Pedido nao encontrado' });
    return;
  }
  if (req.user!.role !== 'admin' && order.user_id !== req.user!.id) {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }
  order.items = prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  res.json(order);
});

router.post('/', authenticate, (req: AuthRequest, res: Response) => {
  const { items, address, phone, notes, delivery_name, troco } = req.body;
  if (!items || !items.length || !address || !phone) {
    res.status(400).json({ error: 'Itens, endereco e telefone sao obrigatorios' });
    return;
  }

  let total = 0;

  for (const item of items) {
    const product = prepare('SELECT * FROM products WHERE id = ?').get(item.product_id) as any;
    if (!product) {
      res.status(400).json({ error: `Produto ID ${item.product_id} nao encontrado` });
      return;
    }
    if (product.stock < item.quantity) {
      res.status(400).json({ error: `Estoque insuficiente para ${product.name}` });
      return;
    }
    const price = product.is_promotion && product.promo_price ? product.promo_price : product.price;
    total += price * item.quantity;
  }

  const orderResult = prepare(
    'INSERT INTO orders (user_id, total, address, phone, notes, delivery_name, troco) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user!.id, total, address, phone, notes || '', delivery_name || '', troco || '');

  const orderId = orderResult.lastInsertRowid;

  const insertItem = prepare(
    'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)'
  );
  const updateStock = prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

  for (const item of items) {
    const product = prepare('SELECT * FROM products WHERE id = ?').get(item.product_id) as any;
    const price = product.is_promotion && product.promo_price ? product.promo_price : product.price;
    insertItem.run(orderId, item.product_id, product.name, item.quantity, price);
    updateStock.run(item.quantity, item.product_id);
  }

  saveDatabase();

  const order = prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  order.items = prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

  res.status(201).json(order);
});

router.put('/:id/status', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Status invalido' });
    return;
  }

  const existing = prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Pedido nao encontrado' });
    return;
  }

  prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, req.params.id);
  saveDatabase();

  const updated = prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
  updated.items = prepare('SELECT * FROM order_items WHERE order_id = ?').all(updated.id);

  res.json(updated);
});

export default router;
