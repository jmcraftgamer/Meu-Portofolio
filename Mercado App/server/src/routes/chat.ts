import { Router, Response } from 'express';
import { prepare } from '../database/connection';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/:orderId/messages', authenticate, (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  const order = prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  if (!order) {
    res.status(404).json({ error: 'Pedido nao encontrado' });
    return;
  }
  if (req.user!.role !== 'admin' && order.user_id !== req.user!.id) {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const messages = prepare(
    'SELECT * FROM messages WHERE order_id = ? ORDER BY created_at ASC'
  ).all(orderId);

  res.json(messages);
});

router.post('/:orderId/messages', authenticate, (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { message } = req.body;

  if (!message || !message.trim()) {
    res.status(400).json({ error: 'Mensagem obrigatoria' });
    return;
  }

  const order = prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  if (!order) {
    res.status(404).json({ error: 'Pedido nao encontrado' });
    return;
  }
  if (req.user!.role !== 'admin' && order.user_id !== req.user!.id) {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const result = prepare(
    'INSERT INTO messages (order_id, user_id, sender_role, message) VALUES (?, ?, ?, ?)'
  ).run(orderId, req.user!.id, req.user!.role, message.trim());

  const newMessage = prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newMessage);
});

export default router;
